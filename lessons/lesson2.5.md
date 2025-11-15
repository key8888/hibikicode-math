# 第2章 Pythonを復習しよう！
## 2.5 繰り返し処理と配列の活用

### 説明＆コード
リストの中身を順番に処理したいときは `for` ループを使うよ。数学で言えば、和記号 $\sum$ で順番に足し合わせるイメージ。

```python
scores = [72, 85, 90]
for score in scores:
    print("点数:", score)
```

合計や平均を求めるには、変数に足し込んでいく。平均は公式 $\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$ をコードで表すだけ。

```python
scores = [72, 85, 90]
total = 0
for score in scores:
    total += score
average = total / len(scores)
print("合計:", total)
print("平均:", average)
```

条件分岐（`if`）と合わせると、例えば80点以上の人数を数えることもできる。

```python
count = 0
for score in scores:
    if score >= 80:
        count += 1
print("80点以上の人数:", count)
```

内包表記（ないほうひょうき）は、短く書ける書き方。`[式 for 変数 in リスト]` の形で、新しいリストを作れるよ。

```python
squared = [x ** 2 for x in range(5)]  # 0^2 から 4^2 まで
print(squared)
```

Bokeh で `for` を使うと、例えば複数の関数を同じグラフに描くなんてこともできる。

```python
functions = [lambda x: x, lambda x: x ** 2]
labels = ["y = x", "y = x^2"]
plot = new_plot(title="2つの関数を描く")
for func, label in zip(functions, labels):
    plot_function(func, -2, 2, target_plot=plot, legend_label=label)
```

#### ミニ課題
`temps = [18, 20, 21, 19, 22]` の平均と、20度以上の日の数を `for` と `if` で計算してみよう。結果を `print()` したあと、`y = x` と `y = 2x` を同じグラフに描いて比較してみて。

### 質問タイム
1. `for` ループでリストを回すとき、変数名は何でもいい？
2. 平均を出すときに `len()` を使う理由は？
3. 内包表記を使うとどんなときに便利？

### 振り返り
- [ ] `for` ループでリストを処理する流れを確認した
- [ ] 条件分岐と組み合わせた例を理解した
- [ ] 疑問点をメモした

### 発展
- 成績データから合格者だけを集めた新しいリストを内包表記で作ってみよう。
- 何種類かの一次関数 $y = ax$ をまとめて描いて傾きの違いを観察してみよう。
