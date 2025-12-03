# 第6章 二次関数
## 6.4 y軸・x軸での反転（関数の対称性入門）

### 説明＆コード
反転は「対称性」を感じる第一歩。
- y軸で反転：\( x \rightarrow -x \) を代入すると、グラフが左右反転する。
- x軸で反転：\( y \rightarrow -y \) の形、つまり \( y = -f(x) \) にすると上下反転する。

一次関数でも試せるよ。

```python
plot = new_plot(title="反転の体験", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 元の関数 y = x + 1
plot_function(lambda x: x + 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#1f77b4", legend_label="y = x + 1")

# y軸反転: x -> -x で y = -x + 1
plot_function(lambda x: -x + 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#2ca02c", legend_label="y = -x + 1")

# x軸反転: y -> -y で y = -(x + 1)
plot_function(lambda x: -(x + 1), x_start=-5, x_end=5, target_plot=plot,
              line_color="#d62728", legend_label="y = -(x + 1)")

plot.legend.location = "top_left"
```

三本の線を重ねると、左右反転・上下反転の対称性が目で分かるよ。

#### ミニ課題
`y = 2x - 3` を追加して、左右反転と上下反転をそれぞれ描いてみよう。元の線とどこが対称になっているか確認しよう。

### 質問タイム
1. \( y = f(-x) \) にすると、グラフはどの軸に対して対称？
2. \( y = -f(x) \) にすると、点 \((1, f(1))\) はどこに移動する？

### 振り返り
- [ ] 左右反転・上下反転が式でどう表せるか理解できた？
- [ ] 反転するとグラフの傾きの符号はどう変わるか説明できる？

### 発展
二次関数 \( y = x^2 \) を \( y = ( -x)^2 \) や \( y = -x^2 \) にするとどうなるか、理由も含めて考えてみよう。対称性が見えるはず。
