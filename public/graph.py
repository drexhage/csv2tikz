import tikzplotlib
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

def load_files(e):
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

    category_names = ["Never heard of it", "Not at all", "A little", "Some", "Much", "Very Much"]
    items = list(filter(lambda x: x in df_1.columns, df_2.columns))
    counted_1 = count_values_out_of_100(df_1, items)
    counted_2 = count_values_out_of_100(df_2, items)
    survey(counted_1,counted_2, category_names, False, [name_1, name_2])
    # plt.show()
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

# for every column we need to count all values and determine how many out of 100 are
def count_values_out_of_100(df, items):
    counted_values = {}
    for item in items:
        values, counts = np.unique(df[item].tolist(), return_counts=True)
        counts = (counts / sum(counts)) * 100
        
        for x in [1.0,2.0,3.0,4.0,5.0,10.0]:
            if x not in values:
                values = np.append(values, x)
                counts = np.append(counts, 0)
    
        count = sorted(zip(values, counts))
        count = count[-1:] + count[:-1]
        
        counted_values[item] = [x[1] for x in count]
    return counted_values

def survey(results_1, results_2, category_names, show_numbers, names):
    """
    Parameters
    ----------
    results : dict
        A mapping from question labels to a list of answers per category.
        It is assumed all lists contain the same number of entries and that
        it matches the length of *category_names*.
    category_names : list of str
        The category labels.
    """
    
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

