(ns notebooks.preface
  "SICM preface excerpt — Clay spike. Prose from wiki/preface.md (stripped dialect)."
  (:require [scicloj.kindly.v4.kind :as kind]
            [emmy.env :as e]
            [emmy.mafs :as mafs]))

;; # Preface — Structure and Interpretation of Classical Mechanics
;;
;; Source for this prose: `sicm-book/wiki/preface.md` (jamescrook markdown port).
;; Wiki dialect (`!!Polyglot`, `#page`, `#Footnote`, `#Quote`) stripped by hand.
;; Math kept as `$…$` / `$$…$$` so Clay's markdown path can pick it up.

;; Classical mechanics is deceptively simple. It is surprisingly easy to get the
;; right answer with fallacious reasoning or without real understanding.
;; Traditional mathematical notation contributes to this problem. Symbols have
;; ambiguous meanings that depend on context, and often even change within a
;; given context. For example, a fundamental result of mechanics is the Lagrange
;; equations. In traditional notation the Lagrange equations are written
;;
;; $$\frac{d}{dt}\frac{\partial L}{\partial{\dot{q}}^{i}} - \frac{\partial L}{\partial q^{i}} = 0$$
;;
;; The Lagrangian *$L$* must be interpreted as a function of the position and
;; velocity components *$q^{i}$* and *${\dot{q}}^{i}$*, so that the partial
;; derivatives make sense, but then in order for the time derivative
;; $\frac{d}{dt}$ to make sense solution paths must have been inserted into the
;; partial derivatives of the Lagrangian to make functions of time.
;;
;; We write Lagrange's equations in functional notation as follows:
;;
;; $$D(\partial_{2}L \circ \Gamma[q]) − \partial_{1}L \circ \Gamma[q] = 0$$
;;
;; The formulas stand on their own. They have clear meaning, independent of the
;; informal context. Below, Emmy *computes* that residual instead of typesetting
;; the claim.

;; ## JVM — 표기가 아니라 값 (굽힘)

(defn L-harmonic
  "Book's harmonic oscillator Lagrangian. Not in emmy.env."
  [m k]
  (fn [local]
    (let [q (e/coordinate local)
          v (e/velocity local)]
      (e/- (e/* (e// 1 2) m (e/square v))
           (e/* (e// 1 2) k (e/square q))))))

(kind/tex
 (e/->TeX
  (e/simplify
   ((e/Gamma (e/literal-function 'q)) 't))))

;; Residual of the functional Lagrange equation along a literal path $q$.
;; Should be $k q(t) + m D^{2}q(t)$ (not zero — the *equation* set to zero is
;; the claim; this is the left-hand side).

(kind/tex
 (let [L (L-harmonic 'm 'k)
       q (e/literal-function 'q)
       lhs (e/D (e/compose ((e/partial 2) L) (e/Gamma q)))
       rhs (e/compose ((e/partial 1) L) (e/Gamma q))]
   (e/->TeX (e/simplify ((e/- lhs rhs) 't)))))

;; True path $q=\cos$, $m=k=1$: residual is exactly 0.

(e/simplify (((e/Lagrange-equations (L-harmonic 1 1)) e/cos) 't))

;; ## Figure 1.1 — 오차를 다시 계산한다
;;
;; Book: polynomial path of least action vs $q=\cos t$, max error $< 1.7\times 10^{-4}$
;; at 3 interior points. Same form as proto/sicm.html.

(def q3
  (e/find-path (L-harmonic 1.0 1.0) 0.0 1.0 (/ Math/PI 2) 0.0 3))

(def fig11-err
  (apply max
         (map (fn [i]
                (let [t (* i 0.01)]
                  (Math/abs (- (q3 t) (Math/cos t)))))
              (range 158))))

fig11-err

;; mafs/of-x of `q3` failed: compile-1d ClassCastException Symbol→Number.
;; Keep the scalar as the Fig 1.1 receipt (proto: 1.677e-4). A simple
;; mafs scene still proves emmy-viewers in this page.

(kind/emmy-viewers
 (mafs/of-x (fn [x] (e/square x)) {:color :green}))

;; ## 브라우저에서 살아 있는 Emmy 셀
;;
;; JVM이 구운 값과 별개로, 같은 페이지의 scittle이 Emmy를 다시 돌린다.
;; `:html/deps [:emmy]` 가 daslu scittle.emmy.js 를 싣는다.

(kind/scittle
 '(require '[emmy.env :as e])
 {:html/deps [:emmy]})

(kind/reagent
 ['(fn []
     [:p {:style {:color "green"}}
      "browser: "
      (str (e/->TeX (e/simplify (e/+ 'x 'x))))]) ]
 {:html/deps [:emmy]})
