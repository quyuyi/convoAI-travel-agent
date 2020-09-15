""" Record user query audio
"""
from recorder import *
from auto_recorder import *

def record():
    print("recording...")
    rec = Recorder(channels=1)
    with rec.open('blocking.wav', 'wb') as recfile:
        recfile.record(duration=5.0)

def auto_record():
    a = AutoRecorder()
    a.listen()