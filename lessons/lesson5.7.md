# 第5章 一次関数で作る図形
## 5.7 図形の真偽判定ミニゲームを作る

### 説明＆コード
「この領域に点が入るか？」を判定する簡単ゲームを作ろう。直線で囲まれた三角形の内側なら「セーフ」、外なら「アウト」と表示する。

三角形の辺の式を使い、点 \((x, y)\) が3本の直線のどちら側にあるかをチェックするだけで判定できる。

```python
from bokeh.models import TextInput, Div, Button, CustomJS

plot = new_plot(title="領域判定ゲーム", width=600, height=420)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 三角形（y = x, y = -x + 4, y = 0）
plot_function(lambda x: x, x_start=-1, x_end=5, target_plot=plot, line_color="#1f77b4")
plot_function(lambda x: -x + 4, x_start=-1, x_end=5, target_plot=plot, line_color="#d62728")
plot_function(lambda x: 0, x_start=-1, x_end=5, target_plot=plot, line_color="#2ca02c")
plot.patch([2, 4, 0], [2, 0, 0], color="#c6dbef", alpha=0.4)

# 入力欄と結果表示
x_input = TextInput(title="x座標", value="1")
y_input = TextInput(title="y座標", value="1")
result = Div(text="ここに結果が出るよ")
button = Button(label="判定！", button_type="primary")

callback = CustomJS(args=dict(xi=x_input, yi=y_input, res=result), code="""
    const x = parseFloat(xi.value);
    const y = parseFloat(yi.value);
    // 三角形の内側条件: y >= 0, y <= x, y <= -x + 4
    const inside = (y >= 0) && (y <= x) && (y <= -x + 4);
    res.text = inside ? `(${x}, ${y}) はセーフ！` : `(${x}, ${y}) はアウト...`;
""")

button.js_on_event("button_click", callback)
```

座標を入力してボタンを押すだけで判定できる。条件式がそのまま境界線の意味になっていることを感じてみよう。

#### ミニ課題
条件を変えて四角形や別の三角形でも判定できるようにしてみよう。条件式をどう書き換えればいいかな？

### 質問タイム
1. 三角形の内側条件を作るとき、なぜ3本の不等式が必要？
2. 座標を整数だけでなく小数で入力したら、判定結果はどうなる？

### 振り返り
- [ ] 自分の入力でセーフ／アウトが変わるのを確認した？
- [ ] 条件式が直線の境界を表していることを理解できた？

### 発展
ランダムに点を生成して、自動で判定・得点するゲームに拡張してみよう。確率的にどれくらいの点が内側に入るかも調べられるよ。
