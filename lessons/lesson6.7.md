# 第6章 二次関数
## 6.7 変化前と後のグラフを“重ねて比較”

### 説明＆コード
元のグラフと変換後のグラフを重ねると、「どこが変わりどこが変わらないか」が一目で分かる。平行移動・反転・伸縮を試してみよう。

```python
plot = new_plot(title="重ねて比較", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 元の直線
plot_function(lambda x: 1.2 * x - 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#1f77b4", legend_label="元の線")

# 平行移動版（右に2、上に1）
plot_function(lambda x: 1.2 * (x - 2) - 1 + 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#ff7f0e", legend_label="右に2 上に1")

# 反転版（上下反転）
plot_function(lambda x: -(1.2 * x - 1), x_start=-5, x_end=5, target_plot=plot,
              line_color="#2ca02c", legend_label="上下反転")

# 伸縮版（傾きを半分）
plot_function(lambda x: 0.6 * x - 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#d62728", legend_label="傾き1/2")

plot.legend.location = "top_left"
```

重ね描きで、傾きが変わると交わり方が変わる、平行移動だと線がずれても平行のまま、などが見やすくなる。

#### ミニ課題
自分で好きな一次関数を1本決めて、平行移動・反転・伸縮の3パターンを重ね描きしてみよう。どの変換が一番見分けやすかった？

### 質問タイム
1. 平行移動と傾き変更を同時にすると、元の線と交わる点はどう変わる？
2. 上下反転した線は、元の線とどの点で交わるか考えてみよう。

### 振り返り
- [ ] 重ね描きすることで、変換ごとの特徴を説明できた？
- [ ] 平行移動と伸縮を見分けるポイントを言葉にできる？

### 発展
二次関数のグラフを、頂点移動版・反転版・縦横の伸縮版と重ねて比較すると、形の変化がより分かりやすい。次の章で試してみよう。
