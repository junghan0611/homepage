(ns eval.clay.notebooks.preface
  "A small Clay/Emmy source receipt. Rendered HTML is not a release artifact."
  (:require [scicloj.kindly.v4.kind :as kind]
            [emmy.env :as e]))

;; # Clay — a mechanics calculation
;;
;; The public Eval page links here as the JVM-side source authority. This notebook
;; deliberately carries no copied chapter and no browser CDN injection.

(defn harmonic-lagrangian [m k]
  (fn [local]
    (let [q (e/coordinate local)
          v (e/velocity local)]
      (e/- (e/* (e// 1 2) m (e/square v))
           (e/* (e// 1 2) k (e/square q))))))

(kind/tex
 (e/->TeX
  (e/simplify
   ((e/Gamma (e/literal-function 'q)) 't))))

;; For q = cos(t), m = k = 1, the Euler–Lagrange residual is zero.

(e/simplify
 (((e/Lagrange-equations (harmonic-lagrangian 1 1)) e/cos) 't))
