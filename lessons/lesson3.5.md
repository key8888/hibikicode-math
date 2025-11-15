# 第3章 最初のグラフ
## 3.5 点のほかに変更可能な部分

### 説明＆コード
点の見た目だけでなく、グラフ全体の雰囲気も調整できる。タイトル、軸ラベル、ツールバーなどを整えると、見る人にやさしいグラフになる。

```python
plot = new_plot(title="気温の推移", width=650, height=400, toolbar_location="above")
plot.title.text_font_size = "18pt"
plot.xaxis.axis_label = "日付"
plot.yaxis.axis_label = "気温 (℃)"
plot.xaxis.major_label_orientation = 0.8  # 0.8ラジアン傾けて重なりを防ぐ
plot.yaxis.major_label_text_color = "#2ca02c"
plot.background_fill_color = "#f7f7f7"
plot.grid.grid_line_dash = "dotted"  # 細かい点線
plot.toolbar.logo = None  # ツールバー左上のロゴを消す
plot.toolbar.autohide = True  # マウスが離れるとツールバーを隠す

# 仮のデータをプロット
x = ["1日", "2日", "3日", "4日", "5日"]
y = [12, 15, 14, 17, 16]
plot_points(x, y, target_plot=plot, size=12, marker="circle", color="#1f77b4", legend_label="東京の気温")
```

`toolbar_location` を "above"（上）、"below"（下）、"left"、"right" などに変えると、ツールが表示される位置が変わる。`plot.background_fill_color` で背景色も変えられるよ。

#### ミニ課題
背景色 (`plot.background_fill_color`) とグリッド線のスタイル (`plot.grid.grid_line_dash`) を自分なりに変えて、見やすい組み合わせを作ってみよう。

### 質問タイム
1. 軸ラベルを付けると、何が伝わりやすくなる？
2. ツールバーを自動的に隠す設定の良いところは？

### 振り返り
- [ ] タイトルや軸ラベルを変更するコードを書ける？
- [ ] 見やすさのために調整したいポイントをリストアップした？

### 発展
学校の掲示物やプレゼン資料を想像しながら、テーマカラーを設定してみよう。例えば学校のシンボルカラーを背景や点に使えば、一体感のあるデザインになるよ。
