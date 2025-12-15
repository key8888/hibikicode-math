# 第3章 最初のグラフ
## 3.9 折れ線グラフを作ってみよう

### 説明＆コード
折れ線グラフは、複数の点を順番に線で結んだもの。変化の様子を見るのにぴったり。`plot.line` に複数の座標を渡せばOKだよ。

```python
months = ["4月", "5月", "6月", "7月", "8月", "9月"]
temperatures = [15, 18, 22, 26, 28, 24]

plot = new_plot(title="月ごとの平均気温", width=650, height=400, toolbar_location="right")
plot.xaxis.axis_label = "月"
plot.yaxis.axis_label = "気温 (℃)"
plot.line(months, temperatures, line_width=3, line_color="#ff7f0e", legend_label="平均気温")
plot_points(months, temperatures, target_plot=plot, size=12, marker="circle", color="#ff7f0e")
```

点と線を同じ色にしておくと、折れ線の一部だと分かりやすいね。

面白い工夫として、データ値をホバー（マウスを乗せる）で表示する方法も紹介。

```python
from bokeh.models import HoverTool

months = ["1週目", "2週目", "3週目", "4週目"]
steps = [4000, 5500, 7000, 8000]

plot = new_plot(title="歩数の推移", width=650, height=400)
plot.line(months, steps, line_width=3, line_color="#1f77b4", legend_label="週間歩数")
plot_points(months, steps, target_plot=plot, size=10, marker="square", color="#1f77b4")

hover = HoverTool(tooltips=[("週", "@x"), ("歩数", "@y")])
plot.add_tools(hover)
```

`HoverTool` は `tooltips` に表示したい項目を指定する。`@x` や `@y` は、プロットしたデータの `x` 値、`y` 値を意味するよ。

#### ミニ課題
自分の一週間の勉強時間や睡眠時間をもとに折れ線グラフを作ろう。ホバーで時間を表示させると、振り返りに便利だよ。

### 質問タイム
1. 折れ線グラフはどんな種類のデータに向いている？
2. HoverToolで表示する内容を変えるには、どこを書き換えればいい？

### 振り返り
- [ ] 点を線で結ぶときのコードを覚えた？
- [ ] ホバー表示で使うキーワード（@x, @y）を理解できた？

### 発展
部活動の練習記録や、気象観測データなどを折れ線グラフにして、季節や努力の変化を分析してみよう。複数の折れ線を重ねれば、比較もできるよ。
