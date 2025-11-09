# レッスン2: 一次関数を描こう

一次関数はグラフがまっすぐな線になる関数です。一般的な式は `y = ax + b` です。傾き `a` を変えると線の傾きが、切片 `b` を変えると線の位置が変わります。

## 目標
- `plot_function` ヘルパーを使って一次関数を複数描く
- グリッド線や凡例の表示方法を学ぶ

## コード例
```python
plot = new_plot(title="一次関数の比較")
plot_function(lambda x: 2 * x + 1, legend_label="2x + 1")
plot_function(lambda x: -0.5 * x + 4, legend_label="-0.5x + 4", line_color="#ef4444")
plot.legend.location = "top_left"
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"
plot.grid.visible = True
```

### チャレンジ
- 傾き `a` や切片 `b` を自分で考えて、別の線を追加してみよう。
- `plot.y_range.start` や `plot.y_range.end` を設定して表示範囲を調整してみよう。
- `plot_points` を使ってデータの点を表示することもできます。

> 先生に理解度を確認してもらったら、次の教材へ進みましょう！
