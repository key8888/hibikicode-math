# 第2章 Pythonを復習しよう！
## 2.7 配列を使った簡単な統計処理

### 説明＆コード
データのまとまりから特徴をつかむのが統計。ここでは最小値・最大値・平均を求めてみよう。平均は数学でいう算術平均で、式は

\[
\bar{x} = \frac{x_1 + x_2 + \cdots + x_n}{n}
\]

だよ。

```python
scores = [68, 75, 82, 90, 88]
minimum = min(scores)
maximum = max(scores)
average = sum(scores) / len(scores)
print("最小値:", minimum)
print("最大値:", maximum)
print("平均:", average)
```

分散（データのばらつき）にも触れておこう。式は

\[
\sigma^2 = \frac{1}{n} \sum_{i=1}^{n} (x_i - \bar{x})^2
\]

これをPythonで計算するとこうなる。

```python
mean_value = sum(scores) / len(scores)
variance = sum((score - mean_value) ** 2 for score in scores) / len(scores)
print("分散:", variance)
```

Bokeh でデータを可視化すると、最小値・最大値がどの点か目で確認しやすいよ。

```python
x_positions = list(range(len(scores)))
plot = new_plot(title="点数データの分布")
plot_points(x_positions, scores, target_plot=plot, legend_label="点数")
```

NumPy（数値計算ライブラリ）を使うと計算がもっと短く書ける。環境によっては `import numpy as np` が必要で、`np.mean(scores)` のように関数で求められるよ。ただし今回の学習では標準の書き方で十分。

#### ミニ課題
自分で考えた5人分のテスト点数リストを作って、最小値・最大値・平均・分散を計算しよう。計算した平均を `print()` したあと、Bokeh で点を表示し、平均値の水平線 `y = 平均` を `plot_function` で一緒に描いてみて。

### 質問タイム
1. 平均の式 $\bar{x}$ を言葉で説明できる？
2. 分散が大きいとデータはどんな様子？
3. NumPy を使うときのメリットは何？

### 振り返り
- [ ] 最小値・最大値・平均・分散を計算できた
- [ ] グラフでデータの広がりを見てみた
- [ ] わからなかったことをメモした

### 発展
- 自分やクラスの学習時間データを集めて、平均や分散を計算してみよう。
- Bokeh で箱ひげ図（box plot）を作るにはどうすればいいか調べてみよう。
