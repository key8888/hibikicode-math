# 第3章 最初のグラフ
## 3.8 線の色を変えるには

### 説明＆コード
線の色もデータのグループ分けに役立つ。`plot.line` や `plot_function` の `line_color` を変えるだけで簡単にカスタマイズできるよ。

```python
plot = new_plot(title="線の色比較")
x = [0, 1, 2, 3, 4, 5]

plot.line(x, [1, 2, 1, 2, 1, 2], line_width=2, line_color="#1f77b4", legend_label="青い線")
plot.line(x, [0, 1, 0, 1, 0, 1], line_width=2, line_color="#ff7f0e", legend_label="オレンジの線")
plot.line(x, [-1, 0, -1, 0, -1, 0], line_width=2, line_color="#2ca02c", legend_label="緑の線")
```

凡例を見れば色とデータの対応がすぐ分かる。`legend_label` は必ず付けておくと親切だね。

カラーパレットを使って、たくさんの色をバランスよく使うこともできる。ここではBokeh内蔵の `Category10` パレットを使う例を紹介。

```python
from bokeh.palettes import Category10

plot = new_plot(title="Category10を使う")

for i in range(5):
    color = Category10[10][i]  # 10色セットのうちi番目
    plot_function(lambda x, n=i: (x - 2) ** 2 - n, x_start=-1, x_end=5, target_plot=plot,
                  line_color=color, line_width=2, legend_label=f"ずらした二次関数 {i}")
```

ラムダ式 `lambda x, n=i: ...` で、ループの値 `i` を固定しつつ関数を作っている。これで二次関数を少しずつずらして描けるよ。

#### ミニ課題
`Category10` の代わりに自分で色のリストを作り、`plot.line` を3本描いてみよう。色とデータの関係を凡例で説明するのを忘れずに！

### 質問タイム
1. 線の色を変えると、どんな情報が読み取りやすくなる？
2. 凡例を付け忘れると、どんな困りごとが起こりそう？

### 振り返り
- [ ] `line_color` の設定方法を覚えた？
- [ ] パレット（色のセット）を使う場面を想像できた？

### 発展
気象データの最高気温、最低気温、平均気温をそれぞれ違う色で描いてみよう。色の意味を凡例や説明文に書くことで、気象ニュースみたいなグラフが作れるよ。
