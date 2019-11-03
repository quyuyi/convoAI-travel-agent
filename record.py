from recorder import *

def record():
    print("recording...")
    rec = Recorder(channels=1)
    with rec.open('blocking.wav', 'wb') as recfile:
        recfile.record(duration=5.0)