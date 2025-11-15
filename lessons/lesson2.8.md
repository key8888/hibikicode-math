# 第2章 Pythonを復習しよう！
## 2.8 関数の概要

### 説明＆コード
関数は「入力を受け取って計算し、結果を返す」まとまり。数学の関数 $f(x) = 2x + 1$ のように、Pythonでも関数を定義できる。`def` で始めて、戻り値は `return` で書くよ。

```python
def add_one(x):
    result = x + 1
    return result

print(add_one(5))  # 6
```

引数（ひきすう）は関数に渡す値のこと。複数あるときはカンマで区切る。リストを扱う例として、平均を求める関数を作ってみよう。

```python
def average(values):
    total = sum(values)
    return total / len(values)

scores = [80, 85, 90]
print(average(scores))
```

関数の中で条件分岐も使える。例えば、平均が80以上なら「合格」、それ以外は「再挑戦」という判定関数。

```python
def judge(scores):
    avg = average(scores)
    if avg >= 80:
        return "合格"
    return "再挑戦"

print(judge([70, 85, 90]))
```

Bokeh では、関数を渡してグラフを描く機能がすでにある。自作関数を `plot_function` に渡せばOK。

```python
def quadratic(x):
    return x ** 2 - 2 * x + 1

plot = new_plot(title="自作関数を描く")
plot_function(quadratic, -3, 3, target_plot=plot, legend_label="y = x^2 - 2x + 1")
```

#### ミニ課題
リストの最大値と最小値の差（レンジ）を返す `data_range(values)` 関数を作ろう。その関数で `heights = [155, 160, 168, 170]` のレンジを計算し、`print()` してみて。さらに、その `heights` データを点で描き、`plot_function` で平均値の水平線も描いて比較しよう。

### 質問タイム
1. `return` を書き忘れると何が起こる？
2. 関数にリストを渡すときのメリットは何？
3. 数学の関数とPythonの関数の共通点と違いは？

### 振り返り
- [ ] 関数の定義と `return` の役割を理解した
- [ ] 配列を扱う関数を書いてみた
- [ ] 疑問をメモした

### 発展
- 一次関数 $f(x) = ax + b$ を作る関数 `linear(a, b)` を定義し、好きな傾き・切片でグラフを描いてみよう。
- データ分析でよく使う「中央値」や「最頻値」を求める関数を自分で実装してみよう。
