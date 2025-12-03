# 第4章 一次関数
## 4.3 Pythonで一次関数を描く（基本編）

### 説明＆コード
`new_plot` と `plot_function` を使えば、一次関数のグラフはすぐ描ける。まずは \( y = 2x + 1 \) を描いてみよう。

```python
plot = new_plot(title="y = 2x + 1", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# y = 2x + 1 のグラフ
plot_function(lambda x: 2 * x + 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#1f77b4", legend_label="y = 2x + 1")

# x の範囲を少し広げてみる
plot.x_range.start = -6
plot.x_range.end = 6
plot.legend.location = "top_left"
```

`x_start` と `x_end` を変えれば、見たい範囲を調整できる。折れ線グラフと違い、ここでは関数をなめらかに描くよ。

#### ミニ課題
傾きや切片を変えて、`y = -0.5x + 3` を描いてみよう。線の傾きと高さがどう変わるか確かめて！

### 質問タイム
1. `x_start` と `x_end` は何を決めている？
2. 折れ線グラフと関数グラフの違いを一言で説明すると？

### 振り返り
- [ ] 自分で一次関数を1本描けた？
- [ ] x の範囲を変えると、グラフの見え方がどう変わるか確認した？

### 発展
同じ式でも、`line_color` や線の太さを変えて「見やすさ」を工夫してみよう。資料作りのセンスも上がるよ。
