# 第6章 二次関数
## 6.2 上下・左右の平行移動を体感しよう

### 説明＆コード
一次関数 \( y = ax + b \) を上下・左右に動かすと式がどう変わるか見てみよう。
- 上下移動：\( y = ax + b + k \) にするとグラフが上下に \(k\) だけ動く。
- 右に \(h\) 動かす：\( y = a(x - h) + b \)。左に動かすときは \(x + h\) の形になる。

スライダーを想定したコードでリアルタイムに動かせる例を書いておくよ。

```python
import numpy as np
from bokeh.models import Slider
from bokeh.layouts import column

plot = new_plot(title="平行移動", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 初期パラメータ
a = 1
b = 0
h_slider = Slider(start=-5, end=5, value=0, step=0.5, title="右への移動 h")
k_slider = Slider(start=-5, end=5, value=0, step=0.5, title="上への移動 k")

# 更新用データ
x_vals = np.linspace(-6, 6, 200)
line_source = ColumnDataSource(data={"x": x_vals, "y": a * x_vals + b})

plot.line("x", "y", source=line_source, line_color="#1f77b4", legend_label="動く直線")
plot.legend.location = "top_left"

# コールバック関数
def update(attr, old, new):
    h = h_slider.value
    k = k_slider.value
    y_vals = a * (x_vals - h) + b + k
    line_source.data = {"x": x_vals, "y": y_vals}

h_slider.on_change("value", update)
k_slider.on_change("value", update)

layout = column(plot, h_slider, k_slider)
```

コードを動かすと、スライダーで上下・左右に動く直線が見られるよ。

#### ミニ課題
`h_slider` を -3 から 3 まで動かして、切片はどう変わるかメモしよう。どんな規則が見える？

### 質問タイム
1. \( y = ax + b + k \) でグラフ全体はどの方向に動く？
2. \( x \) を \( x - h \) に置き換えるとき、グラフは左右どちらに動く？

### 振り返り
- [ ] スライダーで動かしたときの式の変化を言葉で説明できる？
- [ ] 上下移動と左右移動の式の違いを区別できる？

### 発展
二次関数 \( y = x^2 \) でも同じように \( x-h \) や \(+k\) を入れてみるとどうなるか、予想してみよう。次の学習で確かめよう。
