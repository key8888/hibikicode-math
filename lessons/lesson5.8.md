# 第5章 一次関数で作る図形
## 5.8 図形の最適化（どの条件で面積最大？）

### 説明＆コード
図形が最大／最小になる条件を探すのも一次関数でできる。ここでは前節の三角形をベースに、直線の傾きを変えて面積が最大になる条件を手で探ろう。

三角形の面積は
\[
A = \frac{1}{2} \times (x_{20} - x_{10}) \times y_{12}
\]
のように、頂点の位置で決まる。スライダーを動かしながら面積を計算して表示し、どこで最大になるか観察しよう。

```python
from bokeh.models import Slider, Div, CustomJS

plot = new_plot(title="面積の最適化", width=650, height=420)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 固定線 y = 0
plot_function(lambda x: 0, x_start=-2, x_end=6, target_plot=plot, line_color="#2ca02c")

line1 = ColumnDataSource(data=dict(x=[-2, 6], y=[-2 + 1, 6 + 1]))
line2 = ColumnDataSource(data=dict(x=[-2, 6], y=[-(-2) + 4, -(6) + 4]))
verts = ColumnDataSource(data=dict(x=[1.5, 4, -1], y=[2.5, 0, 0]))
plot.patch('x', 'y', source=verts, color="#ffe6cc", alpha=0.5, line_color="#ff7f0e",
           legend_label="三角形")
plot.legend.location = "top_left"

slider = Slider(start=0.5, end=2.5, value=1, step=0.1, title="両方の傾き a")
area_text = Div(text="面積: 計算中")

callback = CustomJS(args=dict(l1=line1, l2=line2, verts=verts, s=slider, area=area_text), code="""
    const a = s.value;
    const xs = [-2, 6];
    l1.data = {x: xs, y: xs.map(x => a * x + 1)};
    l2.data = {x: xs, y: xs.map(x => -a * x + 4)};

    const x12 = 3 / (2 * a);   // (a+a)x = 3
    const y12 = a * x12 + 1;
    const x10 = -1 / a;
    const x20 = 4 / a;

    verts.data = {x: [x12, x20, x10], y: [y12, 0, 0]};

    const base = x20 - x10;
    const height = y12;
    const area_val = 0.5 * Math.abs(base * height);
    area.text = `面積: ${area_val.toFixed(2)}`;

    l1.change.emit();
    l2.change.emit();
    verts.change.emit();
""")

slider.js_on_change("value", callback)
```

スライダーを動かして面積表示を見ながら、最大になりそうな傾きを探そう。実験的に答えを見つけるのも立派な数学！

#### ミニ課題
最大になりそうな傾き \(a\) をメモし、計算でも確認してみよう。\(a\) が大きすぎると面積はどうなる？

### 質問タイム
1. 面積が0になるのはどんなとき？
2. 傾きを同じにしている理由は何？（ヒント: 条件を減らして実験をシンプルにするため）

### 振り返り
- [ ] 面積が変わる様子を見ながら最適な傾きを探せた？
- [ ] 実験結果と計算結果を比べられた？

### 発展
傾きを別々に動かして2変数の最適化を試し、面積の変化を表にまとめてみよう。簡単な「パラメーター探索」もプログラムでできることが分かるよ。
