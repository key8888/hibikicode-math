# 第5章 一次関数で作る図形
## 5.2 多角形の頂点の求め方（交点の連続で作る）

### 説明＆コード
複数の直線の交点を順に結ぶと、多角形ができる。直線同士の交点を計算し、その座標を並べるのがコツ。

例として、次の3本の直線で三角形を作ろう。
\[
\begin{aligned}
 y &= x \\
 y &= -x + 4 \\
 y &= 0
\end{aligned}
\]

```python
plot = new_plot(title="交点で作る三角形", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

plot_function(lambda x: x, x_start=-1, x_end=5, target_plot=plot,
              line_color="#1f77b4", legend_label="y = x")
plot_function(lambda x: -x + 4, x_start=-1, x_end=5, target_plot=plot,
              line_color="#d62728", legend_label="y = -x + 4")
plot_function(lambda x: 0, x_start=-1, x_end=5, target_plot=plot,
              line_color="#2ca02c", legend_label="y = 0")

# 交点を計算
vertices_x = [2, 4, 0]
vertices_y = [2, 0, 0]
plot_points(vertices_x + [vertices_x[0]], vertices_y + [vertices_y[0]],
            target_plot=plot, size=10, color="#9467bd", legend_label="頂点")
plot.legend.location = "top_left"
```

交点3つを結ぶと三角形になる。順番を間違えると折れ線が交差するので、時計回りや反時計回りの順で並べよう。

#### ミニ課題
直線 `y = 3` を追加して四角形を作ってみよう。どこを交点として拾えばいいか考えて並べてみてね。

### 質問タイム
1. 交点の座標を並べる順番を間違えると、グラフはどう見える？
2. 座標を計算する代わりに、目で読み取るとどんな問題が起きる？

### 振り返り
- [ ] 交点を計算して頂点リストを作れた？
- [ ] 順番に注意しながら点を結べた？

### 発展
5本以上の直線を使って複雑な多角形を作り、どの順番で結べば綺麗に見えるか工夫してみよう。凸多角形と凹多角形の違いにも注目！
