# 第6章 二次関数
## 6.9 ミニ演習：動かしたグラフの式を当てるクイズ

### 説明＆コード
アニメーションで動かしたグラフを見て、どんな変換をしたか当てるクイズで復習しよう。ここではランダムに平行移動と反転を混ぜた線を描く例を書くよ。

```python
import numpy as np
import random
from bokeh.models import Button
from bokeh.layouts import column

plot = new_plot(title="当てるクイズ", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 元の線を固定
plot_function(lambda x: x, x_start=-6, x_end=6, target_plot=plot,
              line_color="#1f77b4", legend_label="元の線 y = x")

x_vals = np.linspace(-6, 6, 200)
quiz_source = ColumnDataSource(data={"x": x_vals, "y": x_vals})
plot.line("x", "y", source=quiz_source, line_color="#ff7f0e", legend_label="クイズの線")
plot.legend.location = "top_left"

answer_text = ""

button = Button(label="新しい問題を出す", button_type="success")

def new_quiz():
    h = random.choice([-3, -2, -1, 1, 2, 3])
    k = random.choice([-2, -1, 1, 2])
    flip_x = random.choice([True, False])
    flip_y = random.choice([True, False])

    x_calc = x_vals - h
    y_vals = x_calc + k
    if flip_x:
        x_calc = -x_calc
        y_vals = x_calc + k
    if flip_y:
        y_vals = -y_vals

    quiz_source.data = {"x": x_vals, "y": y_vals}
    flip_info = "左右反転" if flip_x else "左右そのまま"
    flip_info2 = "上下反転" if flip_y else "上下そのまま"
    button.label = f"h={h}, k={k}, {flip_info}, {flip_info2} (答え確認用)"

new_quiz()
button.on_click(lambda: new_quiz())
layout = column(plot, button)
```

ボタンを押すたびに違う変換がかかるから、式を頭の中で組み立ててみて。ボタンのラベルに答えヒントを出しておいたよ。

#### ミニ課題
自分で \(h\) や \(k\) の候補を増やしてみよう。どんな組み合わせが一番迷いやすいか探してみて。

### 質問タイム
1. 右に 2、上に 3 動かしたときの式はどうなる？
2. 左右反転と上下反転を同時にすると、元の線 \(y = x\) はどの線になる？

### 振り返り
- [ ] グラフの動きを見て、どの式変形が行われたか言い当てられた？
- [ ] 平行移動と反転を混ぜたときの式を自分で書ける？

### 発展
二次関数版のクイズを作ってみよう。頂点の移動や反転が分かるか挑戦してみてね。ゲーム感覚で最短で答えられるようになると強い！
