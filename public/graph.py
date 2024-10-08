import tikzplotlib
import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
from pyscript import display, window
from js import document
import pandas as pd
from io import StringIO
import json

ls = window.localStorage

def clean_df(df):
    df = df.iloc[:, 1::2]
    df.dropna(inplace=True)
    df.rename(columns=remove_last_dot_number, inplace=True)
    return df

def string_to_int(input):
    if input:
        return int(input)
    return -1

def generate_graph_norm(e):
    file_1 = string_to_int(document.getElementById("file_1_form_control").getElementsByTagName("input")[0].value)
    file_2 = string_to_int(document.getElementById("file_2_form_control").getElementsByTagName("input")[0].value)

    name_1 = document.getElementById("file_1_name").value
    name_2 = document.getElementById("file_2_name").value

    ignore_every_second_column = document.getElementById("ignore_every_second_column").checked

    storage = json.loads(ls.getItem("persist:root"))
    csv_string_1 = StringIO(json.loads(storage["files"])[file_1]["txt"])
    csv_string_2 = StringIO(json.loads(storage["files"])[file_2]["txt"])
    df_1 = pd.read_csv(csv_string_1, sep=",")
    df_2 = pd.read_csv(csv_string_2, sep=",")

    if ignore_every_second_column:
        df_1 = clean_df(df_1)
        df_2 = clean_df(df_2)

    items = list(filter(lambda x: x in df_1.columns, df_2.columns))
    counted_1 = count_values(df_1, items)
    counted_2 = count_values(df_2, items)
    norm_chart(counted_1,counted_2, False, [name_1, name_2])

    display(plt, target="graph_output", append=False)
    display(tikzplotlib.get_tikz_code(), target="tikz_output", append=False)

def generate_graph_pie(e):
    file = string_to_int(document.getElementById("file_1_form_control").getElementsByTagName("input")[0].value)
    name = document.getElementById("file_1_name").value

    ignore_every_second_column = document.getElementById("ignore_every_second_column").checked

    storage = json.loads(ls.getItem("persist:root"))
    csv_string = StringIO(json.loads(storage["files"])[file]["txt"])
    df = pd.read_csv(csv_string, sep=",")

    if ignore_every_second_column:
        df = clean_df(df)

    counted = count_values(df, df.columns)
    # plt.show()
    pie_chart(counted, False)
    display(plt, target="graph_output", append=False)
    display(tikzplotlib.get_tikz_code(), target="tikz_output", append=False)

def generate_graph_bar(e):
    storage = json.loads(ls.getItem("persist:root"))
    ignore_every_second_column = document.getElementById("ignore_every_second_column").checked
    use_absolute_values = document.getElementById("use_absolute_values").checked
    compare_with_file = document.getElementById("compare_with_file").checked

    file_1 = string_to_int(document.getElementById("file_1_form_control").getElementsByTagName("input")[0].value)
    name_1 = document.getElementById("file_1_name").value

    if compare_with_file:
        file_2 = string_to_int(document.getElementById("file_2_form_control").getElementsByTagName("input")[0].value)
        name_2 = document.getElementById("file_2_name").value

    csv_string_1 = StringIO(json.loads(storage["files"])[file_1]["txt"])
    df_1 = pd.read_csv(csv_string_1, sep=",")

    if compare_with_file:
        csv_string_2 = StringIO(json.loads(storage["files"])[file_2]["txt"])
        df_2 = pd.read_csv(csv_string_2, sep=",")

    if ignore_every_second_column:
        df_1 = clean_df(df_1)
        if compare_with_file:
            df_2 = clean_df(df_2)

    counted_1 = count_values(df_1, df_1.columns, absolute=use_absolute_values)
    if compare_with_file:
        counted_2 = count_values(df_2, df_2.columns, absolute=use_absolute_values)

    if compare_with_file:
        bar_chart_compare(counted_1, counted_2, use_absolute_values, [name_1, name_2])
    else:
        bar_chart(counted_1, use_absolute_values)

    display(plt, target="graph_output", append=False)
    display(tikzplotlib.get_tikz_code(), target="tikz_output", append=False)

def remove_last_dot_number(s):
    # Check if the last character is a digit or
    # Check if the string is not empty and has at least two characters
    if not s[-1].isdigit() or len(s) < 2:
        return s
    
    # Traverse the string in reverse to find the dot
    for i in range(len(s) - 2, -1, -1):
        if s[i] == '.':
            # Check if the substring after the dot is a number
            if s[i+1:].isdigit():
                # Remove the dot and the number
                return s[:i]
            else:
                return s
        elif not s[i].isdigit():
            return s
    return s

def get_ordering_list():
    ordering_list = []
    list = document.getElementById("legend_list")
    for child in list.children:
        ordering_list.append(int(child.getAttribute('data-rbd-drag-handle-draggable-id')))
    return ordering_list

def get_category_names():
    category_names = []
    list = document.getElementById("legend_list")
    for child in list.children:
        category_names.append(child.getElementsByTagName("input")[0].value)
    return category_names

# for every column we need to count all values and determine how many out of 100 are
def count_values(df, items, absolute=False):
    counted_values = {}
    ordering_list = get_ordering_list()
    for item in items:
        values, counts = np.unique(df[item].tolist(), return_counts=True)
        if not absolute:
            counts = (counts / sum(counts)) * 100
        
        for x in [1.0,2.0,3.0,4.0,5.0,10.0]:
            if x not in values:
                values = np.append(values, x)
                counts = np.append(counts, 0)
    
        # count = sorted(zip(values, counts))
        count = [x for _, x in sorted(zip(ordering_list, zip(values, counts)))]

        count = count[-1:] + count[:-1]
        
        counted_values[item] = [x[1] for x in count]
    return counted_values

def norm_chart(results_1, results_2, show_numbers, names):
    category_names = get_category_names()
    
    labels = list(results_1.keys())
    x = np.arange(len(labels))
    
    data = np.array(list(results_1.values()))
    data_cum = data.cumsum(axis=1)
    
    data_2 = np.array(list(results_2.values()))
    data_cum_2 = data_2.cumsum(axis=1)
    
    category_colors = plt.colormaps['RdYlGn'](
        np.linspace(0.15, 0.85, data.shape[1]))

    fig, ax = plt.subplots()
    ax.invert_yaxis()
    #ax.xaxis.set_visible(False)
    fig.set_figwidth(9)
    plt.subplots_adjust(left=0.2)
    xticks = np.arange(110, step=20)
    ax.set_xticks(xticks)
    ax.set_xticklabels([f'{x}%' for x in xticks])
    ax.set_xlim(0, np.sum(data, axis=1).max())

    for i, (colname, color) in enumerate(zip(category_names, category_colors)):
        widths = data[:, i]
        starts = data_cum[:, i] - widths
        rects = ax.barh(labels, widths, left=starts, height=0.25,
                        label=colname, color=color)

        r, g, b, _ = color
        text_color = 'white' if r * g * b < 0.5 else 'darkgrey'
        ax.bar_label(rects, labels=[f'{int(v)}' if v != 0 and show_numbers  else '' for v in rects.datavalues], label_type='center', color=text_color)

    ax.set_yticks(np.array(ax.get_yticks()).astype(float) + 0.15)

    for i, (colname, color) in enumerate(zip(category_names, category_colors)):
        widths = data_2[:, i]
        starts = data_cum_2[:, i] - widths
        
        rects = ax.barh(x+0.3, widths, left=starts, height=0.25,
                        label=colname, color=color)

        r, g, b, _ = color
        text_color = 'white' if r * g * b < 0.5 else 'darkgrey'
        ax.bar_label(rects, labels=[f'{int(v)}' if v != 0 and show_numbers else '' for v in rects.datavalues], label_type='center', color=text_color)

    # Create a second y-axis for the right side
    ax2 = ax.twinx()
    
    ax2.invert_yaxis()
    ax2.xaxis.set_visible(False)
    ax2.set_xlim(0, np.sum(data, axis=1).max())
    ax2.set_ylim(ax.get_ylim())

    x_duplicate = np.repeat(ax.get_yticks(), 2).astype(float)
    x_duplicate[0::2] -= 0.15
    x_duplicate[1::2] += 0.15
    
    # Set ticks and labels for the right side
    ax2.set_yticks(x_duplicate)
    ax2.set_yticklabels(names * len(results_1))
    
    ax.legend(category_names, ncol=len(category_names), bbox_to_anchor=(0, 1),
              loc='lower left', fontsize='small')

    return fig, ax

def pie_chart(results, show_numbers):
    category_names = get_category_names()
    labels = list(results.keys())
    data = np.array(list(results.values()))
    category_colors = plt.colormaps['RdYlGn'](
        np.linspace(0.15, 0.85, data.shape[1]))
    category_colors_hex = [mpl.colors.rgb2hex(x, keep_alpha=False) for x in category_colors]

    fig, ax = plt.subplots(3, 3, subplot_kw={'aspect':'equal'})
    for i in range(3):
        for j in range(3):
            idx = 3 * i + j
            ax[i][j].set_title(labels[idx], fontsize='small')
            ax[i][j].pie(data[idx], colors=category_colors_hex)

    fig.legend(category_names, ncol=len(category_names),
              loc='upper center', fontsize='small')

def bar_chart(results, use_absolute_values):
    category_names = get_category_names()
    labels = list(results.keys()) # logical lines etc
    data = np.array(list(results.values()))
    category_colors = plt.colormaps['RdYlGn'](
        np.linspace(0.15, 0.85, data.shape[1]))
    category_colors_hex = [mpl.colors.rgb2hex(x, keep_alpha=False) for x in category_colors]

    x = np.arange(len(labels))  # the label locations
    width_factor = 0.9 # how much space between the bar groupings (0.1 a lot of space, 0.9 very little space)
    width = width_factor * (1.5 * (1 / len(labels)))  # the width of one bar

    fig, ax = plt.subplots()
    ax.grid(zorder=0, axis='y')
    for i, category in enumerate(category_names): # for never heard of it etc
        category_data = [x[i] for x in data]
        x_position = x + width * len(category_names) / 2 - width / 2 - width * i
        ax.bar(x_position, category_data, width, label=category, color=category_colors[i], zorder=2)

    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=15, fontsize='xx-small')
    if not use_absolute_values:
        ax.yaxis.set_major_formatter(mpl.ticker.PercentFormatter())
    # ax.set_ylabel('Scores')
    # ax.set_title('Scores by group and gender')

    fig.legend(category_names, ncol=len(category_names),
              loc='upper center', fontsize='small')

def bar_chart_compare(results_1, results_2, use_absolute_values, names):
    category_names = get_category_names()
    labels = list(results_1.keys())
    data_1 = np.array(list(results_1.values()))
    data_2 = np.array(list(results_2.values()))
    category_colors = plt.colormaps['RdYlGn'](
        np.linspace(0.15, 0.85, data_1.shape[1]))
    category_colors_hex = [mpl.colors.rgb2hex(x, keep_alpha=False) for x in category_colors]

    x = np.arange(len(labels))  # the label locations
    width_factor = 0.9 # how much space between the bar groupings (0.1 a lot of space, 0.9 very little space)
    width = width_factor * (1.5 * (1 / len(labels)))  # the width of one bar

    fig, ax = plt.subplots(1, 2)
    # ax.grid(zorder=0, axis='y')
    data = [data_1, data_2]
    for j in range(2):
        for i, category in enumerate(category_names): # for never heard of it etc
            category_data = [x[i] for x in data[j]]
            x_position = x + width * len(category_names) / 2 - width / 2 - width * i
            ax[j].bar(x_position, category_data, width, label=category, color=category_colors[i], zorder=2)
        ax[j].set_xticks(x)
        ax[j].set_title(names[j])
        ax[j].set_xticklabels(labels, rotation=20, fontsize='xx-small')

    # ax.set_ylabel('Scores')
    # ax.set_title('Scores by group and gender')

    fig.legend(category_names, ncol=len(category_names),
              loc='upper center', fontsize='small')

# when file is done loading, make sure to let the application know through this hint
display("true", target="pyscript_loaded", append=False)
