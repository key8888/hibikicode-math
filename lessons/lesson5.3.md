# 第5章 一次関数で作る図形
## 5.3 Pythonで領域を塗ってみよう

### 説明＆コード
Bokehの `patch` を使うと、多角形の中を塗れる。交点を並べた座標リストをそのまま渡すだけ。例として、前の節で作った三角形を塗ってみよう。

```python
plot = new_plot(title="領域を塗る", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 三角形の頂点（前回の例）
vertices_x = [2, 4, 0]
vertices_y = [2, 0, 0]

# 枠となる直線も描いておく
plot_function(lambda x: x, x_start=-1, x_end=5, target_plot=plot,
              line_color="#1f77b4", legend_label="y = x")
plot_function(lambda x: -x + 4, x_start=-1, x_end=5, target_plot=plot,
              line_color="#d62728", legend_label="y = -x + 4")
plot_function(lambda x: 0, x_start=-1, x_end=5, target_plot=plot,
              line_color="#2ca02c", legend_label="y = 0")

# 領域を塗る
plot.patch(vertices_x, vertices_y, color="#ffeda0", alpha=0.6, line_color="#9467bd",
           legend_label="塗った領域")
plot.legend.location = "top_left"
```

塗ると領域がくっきり見える。どの直線で囲まれているかを視覚的につかみやすいね。

#### ミニ課題
頂点の順番を変えて `patch` を描いてみよう。塗りつぶしがどう歪むかを観察して、正しい順番の大切さを感じてみて。

### 質問タイム
1. `patch` に渡す x, y のリストはどんな順番で並べるのが良い？
2. `alpha` を小さくすると、どんな見た目になる？

### 振り返り
- [ ] 自分で領域を塗るコードを書けた？
- [ ] 頂点の順序の重要性を確認できた？

### 発展
複数の領域を別の色で塗り、重なる部分を透明度で表現してみよう。集合の図や地図の重ね合わせにも応用できるよ。
