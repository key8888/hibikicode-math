# レッスン3: 二次関数と組み合わせ

二次関数 `y = ax^2 + bx + c` は放物線の形になります。`a` の値によって開き方が変わり、`b` や `c` を変えるとグラフが移動します。

## 目標
- 二次関数を描画して形の変化を観察する
- `plot_parametric` を使って円やサインカーブなども描いてみる

## コード例
```python
plot = new_plot(title="二次関数と応用")
plot_function(lambda x: x**2, legend_label="y = x^2")
plot_function(lambda x: 0.25 * (x - 2)**2 - 3, legend_label="0.25(x-2)^2 - 3", line_color="#22c55e")
plot_parametric(lambda t: 3 * math.cos(t), lambda t: 3 * math.sin(t), t_start=0, t_end=2 * math.pi, legend_label="円", line_color="#eab308")
plot.legend.click_policy = "hide"
```

### チャレンジ
- 係数 `a, b, c` を変えて、頂点の位置の変化を確かめよう。
- `plot_parametric` の `t_start` や `t_end` を変えて、曲線の一部だけ描画してみよう。
- `plot_points` で実験データを組み合わせてみよう。

> ここまで学んだことを使って、自分だけのグラフ作品を作ってみましょう！
