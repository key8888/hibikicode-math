# 第5章 一次関数で作る図形
## 5.9 まとめ：一次関数でできる世界の広さ

### 説明＆コード
ここまでで、一次関数が単なる直線の式ではなく、図形・領域・アニメーション・最適化まで広がることを体験した。最後に、いくつかの直線をまとめて表示し、これまでのテーマを振り返ろう。

```python
plot = new_plot(title="一次関数のまとめ", width=650, height=420)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# いろいろな直線
plot_function(lambda x: x + 1, x_start=-4, x_end=4, target_plot=plot,
              line_color="#1f77b4", legend_label="基本形 y = x + 1")
plot_function(lambda x: -x + 3, x_start=-4, x_end=4, target_plot=plot,
              line_color="#d62728", legend_label="交点を作る y = -x + 3")
plot_function(lambda x: 0.5 * x - 1, x_start=-4, x_end=4, target_plot=plot,
              line_color="#2ca02c", legend_label="別の傾き")
plot.legend.location = "top_left"

# 直線でできる三角形を軽く塗る
plot.patch([0, 2, -2], [0, 2, -1], color="#ffeda0", alpha=0.4,
           line_color="#9467bd", legend_label="領域の例")
```

このシンプルなコードの中に、傾き・切片・交点・領域のアイデアが全部詰まっている。一次関数の世界は思ったより広い！

#### ミニ課題
自分が印象に残ったコード断片を1つ選び、コメントで「何を学んだか」を書き加えて保存してみよう。

### 質問タイム
1. 傾きや切片を変えることで、どんな種類の図形や領域が作れた？
2. 交点や面積を考えると、一次関数のどんな力を感じた？

### 振り返り
- [ ] 第4〜5章で学んだことを一言でまとめた？
- [ ] これから二次関数に進むとき、どんな疑問を持っている？

### 発展
二次関数に進んだとき、一次関数との共通点・違いをノートにまとめてみよう。グラフの形や交点の考え方がどのように広がるかを想像してみて！
