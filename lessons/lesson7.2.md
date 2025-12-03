# 第7章 三次関数
## 7.2 散布図（scatter plot）を描いてみよう

### 説明＆コード
散布図はデータの「ばらつき」と「傾向」を一度に見せてくれる。Bokeh の `plot_points` を使って簡単に描けるよ。

```python
# 簡単なデータ例
x_vals = [0, 1, 2, 3, 4, 5, 6]
y_vals = [0.5, 1.0, 1.8, 2.7, 3.5, 4.2, 6.0]

plot = new_plot(title="散布図を描く", width=600, height=400)
plot.xaxis.axis_label = "時間"
plot.yaxis.axis_label = "温度"

plot_points(x_vals, y_vals, target_plot=plot, size=10, marker="circle", color="#d62728", legend_label="観測値")
plot.legend.location = "top_left"
```

点の集まりから、直線的に増えているのか、途中で曲がるのかを目で確かめよう。

#### ミニ課題
`x_vals` と `y_vals` を自分の好きなデータに変えて散布図を作ろう。横軸と縦軸にどんな意味を持たせたかも書き出してみて。

### 質問タイム
1. 散布図の点が一直線に並ぶほど、何が言える？
2. 点が上に行ったり下に行ったりバラバラなとき、どんなことが考えられる？

### 振り返り
- [ ] `plot_points` の使い方を覚えた？
- [ ] 散布図の見方（傾向とばらつき）を説明できる？

### 発展
気象データやゲームのスコア推移を散布図にして、時間とともにどう変化するかを眺めてみよう。変化の「速さ」も見えてくるかも。
