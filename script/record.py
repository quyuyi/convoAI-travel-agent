from recorder import *

rec = Recorder(channels=2)
with rec.open('blocking.wav', 'wb') as recfile:
    recfile.record(duration=5.0)