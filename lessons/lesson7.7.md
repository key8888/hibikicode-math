# 第7章 三次関数
## 7.7 スライダーで傾き・切片を調整して“最適な直線探し”

### 説明＆コード
ゲーム感覚で傾きと切片を動かし、データに最も近い直線を探してみよう。スライダーを動かすとリアルタイムで線が変わるよ。

```python
import numpy as np
from bokeh.models import Slider
from bokeh.layouts import column

x_vals = np.linspace(0, 6, 200)
data_x = [0, 1, 2, 3, 4, 5, 6]
data_y = [0.5, 1.0, 1.8, 2.7, 3.5, 4.2, 6.0]

plot = new_plot(title="スライダーでフィット", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

plot_points(data_x, data_y, target_plot=plot, size=10, color="#1f77b4", legend_label="データ")

slope_slider = Slider(start=0.0, end=1.5, value=0.8, step=0.05, title="傾き a")
intercept_slider = Slider(start=-1.0, end=1.5, value=0.3, step=0.05, title="切片 b")

line_source = ColumnDataSource(data={"x": x_vals, "y": 0.8 * x_vals + 0.3})
plot.line("x", "y", source=line_source, line_color="#d62728", legend_label="調整中の線")
plot.legend.location = "top_left"

def update(attr, old, new):
    a = slope_slider.value
    b = intercept_slider.value
    line_source.data = {"x": x_vals, "y": a * x_vals + b}

slope_slider.on_change("value", update)
intercept_slider.on_change("value", update)

layout = column(plot, slope_slider, intercept_slider)
```

スライダーを動かしながら、点が線に近づいたり離れたりする様子を観察しよう。自分のベストな組み合わせを見つけてね。

#### ミニ課題
傾きと切片を動かして、誤差（データとの差）が一番小さそうな組み合わせをメモしよう。数値はいくつ？

### 質問タイム
1. 傾きと切片を同時に動かすと、線のどこが変わる？
2. 誤差を目で見て小さくしたいとき、どこに注目するといい？

### 振り返り
- [ ] スライダー操作で直線フィッティングの感覚をつかめた？
- [ ] 傾き・切片の調整がグラフにどう影響するか説明できる？

### 発展
誤差を数値で表示するように改造してみよう。傾きと切片を変えると誤差がどう上下するかグラフ化すると、最適化の雰囲気がつかめるよ。
