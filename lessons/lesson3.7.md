# 第3章 最初のグラフ
## 3.7 線の太さを変えるには

### 説明＆コード
線の太さは情報の優先度を伝えるのに使える。Bokehでは `plot.line` や `plot_function` の `line_width` 引数で指定できる。数値が大きいほど太くなるよ。

```python
plot = new_plot(title="線の太さくらべ")
x = [0, 1, 2, 3, 4]
y_base = [1, 2, 1, 3, 2]

widths = [1, 2, 4]
colors = ["#1f77b4", "#ff7f0e", "#2ca02c"]
labels = ["line_width=1", "line_width=2", "line_width=4"]

for offset, (w, color, label) in enumerate(zip(widths, colors, labels)):
    y = [value + offset * 0.5 for value in y_base]
    plot.line(x, y, line_width=w, line_color=color, legend_label=label)
```

オフセットを足してラインが重ならないようにしている。太い線は目に留まりやすいので、重要なデータを強調するのにぴったり。

`plot_function` でも同じように `line_width` を渡せる。

```python
def linear(x):
    return 2 * x + 1

def quadratic(x):
    return x ** 2 - 2

plot = new_plot(title="一次と二次の比較")
plot_function(linear, x_start=-2, x_end=2, target_plot=plot, line_color="#d62728", line_width=2, legend_label="一次関数")
plot_function(quadratic, x_start=-2, x_end=2, target_plot=plot, line_color="#9467bd", line_width=4, legend_label="二次関数")
```

二次関数の方を太く描くことで、変化の様子が目立つようにしているよ。

#### ミニ課題
2本以上の線を描いて、どれが一番重要かを太さで表してみよう。友だちに見せて、意図通りに伝わるか確認するとさらに良いね。

### 質問タイム
1. `line_width` を大きくしすぎると、どんな問題が起こりそう？
2. 線の太さ以外に強調する方法には何がある？

### 振り返り
- [ ] `line_width` を変えるコードを書ける？
- [ ] 強調したいデータをどうやって選ぶか考えた？

### 発展
交通量のグラフなどで、混雑している時間帯の線を太くしてみよう。一目見るだけででピークがどこか分かるようになるよ。
