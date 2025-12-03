# 第6章 二次関数
## 6.3 拡大・縮小（縦方向・横方向の伸び縮み）

### 説明＆コード
一次関数でも「伸び縮み」が体感できるよ。
- 縦方向（傾き）の伸縮：\( y = a x \)。\(a\) を大きくすると線が急になり、小さくすると平らになる。
- 横方向の伸縮：\( y = f(cx) \) のように \(x\) を圧縮・拡大させる。\(c\) が大きいと横に縮み、小さいと横に広がる。

次のコードで、縦方向と横方向の変化を同時に試せるよ。

```python
import numpy as np
from bokeh.models import Slider
from bokeh.layouts import column

plot = new_plot(title="伸び縮み", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

k_slider = Slider(start=0.2, end=3, value=1, step=0.2, title="縦方向の倍率 k")
c_slider = Slider(start=0.2, end=3, value=1, step=0.2, title="横方向での圧縮 c")

x_vals = np.linspace(-5, 5, 200)
source = ColumnDataSource(data={"x": x_vals, "y": x_vals})

plot.line("x", "y", source=source, line_color="#2ca02c", legend_label="変化する直線")
plot.legend.location = "top_left"

def update(attr, old, new):
    k = k_slider.value
    c = c_slider.value
    y_vals = k * (c * x_vals)
    source.data = {"x": x_vals, "y": y_vals}

k_slider.on_change("value", update)
c_slider.on_change("value", update)

layout = column(plot, k_slider, c_slider)
```

縦方向の倍率 \(k\) が傾きに、そのまま横方向の圧縮 \(c\) が \(x\) の伸び縮みに効くことを確かめてね。

#### ミニ課題
`k_slider` を 0.5 に、`c_slider` を 2 にすると線はどう見える？傾きと横方向の変化を文章でまとめてみよう。

### 質問タイム
1. \( y = kx \) で \(k\) が 0.5 になると、傾きはどう変わる？
2. \( y = f(cx) \) の形で \(c\) が大きいと横方向はどうなる？

### 振り返り
- [ ] 縦方向と横方向の伸縮が式のどこに現れるか分かった？
- [ ] 傾きと \(x\) の係数を変えたときの見た目の違いを説明できる？

### 発展
二次関数 \( y = x^2 \) を \( y = (cx)^2 \) にしたとき、グラフの「幅」はどう変わるか予想して、紙にスケッチしてみてね。
