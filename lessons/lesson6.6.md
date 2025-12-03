# 第6章 二次関数
## 6.6 Pythonで平行移動・反転・伸縮アニメーション

### 説明＆コード
スライダーを使って一次関数をリアルタイムで動かすアニメーションを作ろう。上下移動、左右移動、反転、伸縮を一度にいじれるよ。

```python
import numpy as np
from bokeh.models import Slider, CheckboxGroup
from bokeh.layouts import column

plot = new_plot(title="動く一次関数", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# スライダーとチェックボックス
slope_slider = Slider(start=-3, end=3, value=1, step=0.2, title="傾き a")
shift_x_slider = Slider(start=-5, end=5, value=0, step=0.5, title="右への移動 h")
shift_y_slider = Slider(start=-5, end=5, value=0, step=0.5, title="上への移動 k")
flip_box = CheckboxGroup(labels=["左右反転 (x -> -x)", "上下反転 (y -> -y)"])

x_vals = np.linspace(-6, 6, 200)
source = ColumnDataSource(data={"x": x_vals, "y": x_vals})

plot.line("x", "y", source=source, line_color="#9467bd", legend_label="動く線")
plot.legend.location = "top_left"

def update(attr, old, new):
    a = slope_slider.value
    h = shift_x_slider.value
    k = shift_y_slider.value
    x_calc = x_vals - h
    y_vals = a * x_calc + k

    labels = flip_box.labels
    active = flip_box.active

    if 0 in active:  # 左右反転
        x_calc = -x_calc
        y_vals = a * x_calc + k
    if 1 in active:  # 上下反転
        y_vals = -y_vals

    source.data = {"x": x_vals, "y": y_vals}

for widget in [slope_slider, shift_x_slider, shift_y_slider]:
    widget.on_change("value", update)
flip_box.on_change("active", update)

layout = column(plot, slope_slider, shift_x_slider, shift_y_slider, flip_box)
```

傾き・平行移動・反転の組み合わせが、式にどう現れてグラフがどう動くか体感しよう。

#### ミニ課題
傾きを 2、右移動を -2、上下反転を ON にしてみよう。元の線 \(y = x\) と見比べて、どこが変わったかメモしてみて。

### 質問タイム
1. 左右反転を入れるとき、\(x\) の置き換えはどうなる？
2. 上下反転は式のどの部分にマイナスが付く形で表れる？

### 振り返り
- [ ] 傾き・平行移動・反転を同時に操作したときの式の変化を追えた？
- [ ] コードのどの行がどの動きに対応するか説明できる？

### 発展
二次関数 \( y = ax^2 \) に同じスライダーと反転操作を加えるコードを作ってみよう。頂点や「開き」の変化がよく分かるはず。
