import tikzplotlib
import matplotlib.pyplot as plt
import numpy as np
from pyscript import display

def display_graph(e):
    plt.style.use("ggplot")

    t = np.arange(0.0, 2.0, 0.1)
    s = np.sin(2 * np.pi * t)
    s2 = np.cos(2 * np.pi * t)
    plt.plot(t, s, "o-", lw=4.1)
    plt.plot(t, s2, "o-", lw=4.1)
    plt.xlabel("time (s)")
    plt.ylabel("Voltage (mV)")
    plt.title("Simple plot $\\frac{\\alpha}{2}$")
    plt.grid(True)

    display(plt, target="matplotlib_image", append=False)

    display(tikzplotlib.get_tikz_code(), target="tikz_output", append=False)