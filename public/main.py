import tikzplotlib
import matplotlib.pyplot as plt
import numpy as np
from pyscript import display
import asyncio
from pyodide.ffi import create_proxy
from js import document, console
import pandas as pd
from io import BytesIO

async def get_file(e):
    files = e.target.files.to_py()
    for file in files:
        array_buf = await file.arrayBuffer() # Get arrayBuffer from file
        file_bytes = array_buf.to_bytes() # convert to raw bytes array 
        csv_file = BytesIO(file_bytes) # Wrap in Python BytesIO file-like object
        # Read the CSV file into a Pandas DataFrame
        console.log(csv_file)
        df = pd.read_csv(csv_file, on_bad_lines='skip')
        document.getElementById("outMsg").innerHTML = df.head(5)

get_file_proxy = create_proxy(get_file)
document.getElementById("file").addEventListener("change", get_file_proxy)
document.getElementById("outMsg").innerHTML = "Ready"



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