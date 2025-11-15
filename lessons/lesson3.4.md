# 第3章 最初のグラフ
## 3.4 点の色を変えるには

### 説明＆コード
色はデータのグループ分けにぴったり。Bokehでは16進（じゅうろくしん）カラーコードを使うのが基本。`#RRGGBB` の形式で、RR が赤、GG が緑、BB が青の明るさを表す。`00` が暗く、`FF` が明るい。

```python
x = [1, 2, 3, 4, 5]
y = [5, 4, 3, 2, 1]
colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]

plot = new_plot(title="色のサンプル")

for xi, yi, color in zip(x, y, colors):
    plot_points([xi], [yi], target_plot=plot, size=14, marker="circle", color=color, legend_label=f"color={color}")
```

`zip` は複数のリストを同時にループする関数。`colors` の色が順番に使われていくよ。

データによって色を変える例も見てみよう。たとえばテストの得点が80点以上なら青、それ以外はグレーにするなど。

```python
scores = [92, 74, 88, 65, 100, 55]
subjects = ["国語", "数学", "英語", "理科", "社会", "音楽"]

colors = ["#1f77b4" if score >= 80 else "#7f7f7f" for score in scores]

plot = new_plot(title="得点で色分け")
plot_points(subjects, scores, target_plot=plot, size=16, marker="square", color=colors, legend_label="80点以上は青")
```

ここでは `subjects` をそのまま `x` に渡している。Bokehは文字列のカテゴリも扱えるから、棒グラフっぽい配置になる。条件式 `score >= 80` を使ったリスト内包表記で色を決めているよ。

#### ミニ課題
`colors` のリストを自分で作って、グラデーション（徐々に色が変わる）になるようにしてみよう。`#` のあとの数字を少しずつ変えるだけでも雰囲気が変わるよ。

### 質問タイム
1. 16進カラーコードの `FF` はどんな明るさ？
2. 条件式を使って色を変えると、どんな情報が読み取りやすくなる？

### 振り返り
- [ ] カラーコードを見て色のイメージができるようになった？
- [ ] 条件で色分けするアイデアを一つ以上思いついた？

### 発展
学校のアンケート結果などで、カテゴリーごとに色を変えながら点をプロットしてみよう。色の意味を凡例に書けば、プレゼン資料でも使えるグラフになるよ。
