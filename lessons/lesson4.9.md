# 第4章 一次関数
## 4.9 Bokehでの一次関数グラフの“読みやすさ改善”

### 説明＆コード
グラフは「読みやすさ」が大事。色や線幅、凡例、ポイントの強調で見やすくなる。ここでは同じ一次関数でも、表示の工夫で印象が変わることを確認しよう。

```python
plot = new_plot(title="見やすいグラフ作り", width=650, height=420)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# ベースの直線 y = 1.5x + 1
plot_function(lambda x: 1.5 * x + 1, x_start=-4, x_end=4, target_plot=plot,
              line_color="#1f77b4", legend_label="ベースの式")

# ポイントを強調（整数の x だけ）
x_vals = list(range(-3, 4))
y_vals = [1.5 * x + 1 for x in x_vals]
plot_points(x_vals, y_vals, target_plot=plot, size=10, marker="square",
            color="#d62728", legend_label="整数点")

# グリッドと背景を少し調整
plot.xgrid.grid_line_alpha = 0.3
plot.ygrid.grid_line_alpha = 0.3
plot.background_fill_color = "#f7f7f7"
plot.legend.location = "top_left"
```

色を分けたり、点をマーカーで示したりするだけで、一気に情報が読み取りやすくなるよ。

#### ミニ課題
凡例の位置を `"bottom_right"` に変えたり、`marker` を三角形にしたりして、最も見やすい配置を探してみよう。

### 質問タイム
1. 点を強調するメリットは？
2. 背景色を薄くすると、何が見やすくなる？

### 振り返り
- [ ] 凡例・線色・マーカーを自分で変えてみた？
- [ ] どの設定が読みやすいか理由と一緒に説明できた？

### 発展
レポートや発表資料でグラフを使うとき、色覚多様性にも配慮した配色を調べてみよう。安心して読めるグラフ作りにつながるよ。
