# 第5章 一次関数で作る図形
## 5.6 Bokehによる図形アニメーション

### 説明＆コード
スライダーやボタンを組み合わせて、図形をアニメーションさせよう。ここではボタンを押すたびに傾きを少し変えて、三角形がクルクル形を変える仕組みを作る。

```python
from bokeh.models import Button, CustomJS

plot = new_plot(title="図形アニメーション", width=650, height=420)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 初期の三角形（y = x, y = -x + 4, y = 0）
verts = ColumnDataSource(data=dict(x=[2, 4, 0], y=[2, 0, 0]))
plot.patch('x', 'y', source=verts, color="#c6dbef", alpha=0.6, line_color="#1f77b4",
           legend_label="三角形")
plot.legend.location = "top_left"

button = Button(label="傾きを少し変える", button_type="success")

callback = CustomJS(args=dict(verts=verts), code="""
    // x,y を少しずつ回転させるイメージで変換
    const x = verts.data.x.slice();
    const y = verts.data.y.slice();
    for (let i = 0; i < x.length; i++) {
        x[i] = 0.9 * x[i] - 0.1 * y[i];
        y[i] = 0.1 * x[i] + 0.9 * y[i];
    }
    verts.data = {x: x, y: y};
    verts.change.emit();
""")

button.js_on_event("button_click", callback)
```

ボタンを何度か押すと、三角形の形が少しずつ変わっていく。簡易的なアニメーションでも、図形の変化を直感的に感じられるよ。

#### ミニ課題
回転の係数 `0.9` や `0.1` を変えてみよう。大きくするとどんな動きになる？小さくすると？

### 質問タイム
1. `button_click` を使用すると、どの部分のコードが動く？
2. 頂点の座標を毎回上書きすることで、どんな効果が得られている？

### 振り返り
- [ ] ボタンで図形が変形するのを確認した？
- [ ] 係数を変えて動きのスピードを調整できた？

### 発展
スライダーと組み合わせて「連続再生」ボタンや「リセット」ボタンを作ってみよう。小さなUIを組み立てると、教材っぽいアニメーションが完成するよ。
