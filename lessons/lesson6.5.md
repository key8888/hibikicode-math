# 第6章 二次関数
## 6.5 関数を動かして“形を保つ”とは？

### 説明＆コード
平行移動・反転・伸縮は、グラフが動いても「形」は保たれる。このような変換をまとめて、やさしく「アフィン変換」と呼ぶ。

- 平行移動：位置だけ変わり、傾きや角度は同じ。
- 反転：左右または上下にひっくり返るけど直線性は保たれる。
- 伸縮：角度は変わるけど直線であることは変わらない。

直線をいろいろ動かして、重ね描きで形が保たれる感覚を確認しよう。

```python
plot = new_plot(title="形を保つ変換", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 元の直線
plot_function(lambda x: 0.8 * x + 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#1f77b4", legend_label="元の線")

# 平行移動（上に2）
plot_function(lambda x: 0.8 * x + 3, x_start=-5, x_end=5, target_plot=plot,
              line_color="#ff7f0e", legend_label="上に+2")

# 反転（y軸で反転）
plot_function(lambda x: -0.8 * x + 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#2ca02c", legend_label="左右反転")

# 伸縮（傾きを2倍）
plot_function(lambda x: 1.6 * x + 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#d62728", legend_label="縦に2倍")

plot.legend.location = "top_left"
```

どの変換も線は線のまま。形が残ることを目で確かめよう。

#### ミニ課題
`plot_function` をもう一回使って、元の直線を右に 2、下に 1 平行移動させた線を追加してみよう。元の線と平行になっているかチェック！

### 質問タイム
1. 平行移動しても直線の傾きが変わらない理由は？
2. 反転したとき、線は直線のままかどうか確かめる方法は？

### 振り返り
- [ ] 平行移動・反転・伸縮が「形を保つ」変換だと理解できた？
- [ ] それぞれ式のどこが変わるのか説明できる？

### 発展
二次関数や三角形の図形でも、これらの変換がどう効くか考えてみよう。図形全体を見渡すと、アートや設計の世界にもつながるよ。
