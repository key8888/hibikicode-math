# 第7章 三次関数
## 7.6 ボタンで複数直線を切り替えて比較

### 説明＆コード
複数の候補直線をボタンで切り替えて、どれがデータに近いか目で比べよう。スライダーより手軽に「選ぶ」感覚をつかめるよ。

```python
import numpy as np
from bokeh.models import RadioButtonGroup
from bokeh.layouts import column

x_vals = np.linspace(0, 6, 200)
data_x = [0, 1, 2, 3, 4, 5, 6]
data_y = [0.5, 1.0, 1.8, 2.7, 3.5, 4.2, 6.0]

plot = new_plot(title="直線比較", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

plot_points(data_x, data_y, target_plot=plot, size=10, color="#1f77b4", legend_label="データ")

candidates = [
    (0.7, 0.5),
    (0.9, 0.2),
    (1.1, -0.1)
]

line_source = ColumnDataSource(data={"x": x_vals, "y": candidates[0][0] * x_vals + candidates[0][1]})
plot.line("x", "y", source=line_source, line_color="#d62728", legend_label="候補線")
plot.legend.location = "top_left"

selector = RadioButtonGroup(labels=["傾き0.7,切片0.5", "傾き0.9,切片0.2", "傾き1.1,切片-0.1"], active=0)

def update(attr, old, new):
    a, b = candidates[selector.active]
    line_source.data = {"x": x_vals, "y": a * x_vals + b}

selector.on_change("active", update)

layout = column(plot, selector)
```

ボタンを切り替えながら、どの直線が一番データに寄り添っているか観察しよう。

#### ミニ課題
自分で候補直線をもう1本追加してみよう。傾きや切片をどう選ぶと「良さそう」になるか考えてみてね。

### 質問タイム
1. ボタンを押したときに更新されるのは何のデータ？
2. 候補を増やすとき、どんな値を試すと違いが分かりやすい？

### 振り返り
- [ ] 複数直線を視覚的に比較するコツをつかめた？
- [ ] コードのどこを変えると候補が増えるか理解できた？

### 発展
三次関数の形（S字）をいくつか用意して、ボタンで切り替えてデータと比べてみよう。どの形が近いか直感を磨こう。
