(ns usage-site
  (:require [scicloj.clay.v2.api :as clay]))

(println "=== multi [:html] two notebooks ===")
(clay/make! {:source-path ["notebooks/index.clj"
                           "notebooks/chapter.clj"
                           "notebooks/preface.clj"]
             :show false
             :browse false
             :base-target-path "docs-site"
             :flatten-targets true
             :format [:html]})

(println "=== quarto book (expect local quarto HTML fail) ===")
(try
  (clay/make! {:source-path ["notebooks/index.clj"
                             "notebooks/chapter.clj"]
               :show false
               :browse false
               :base-target-path "docs-book"
               :flatten-targets true
               :format [:quarto :html]
               :book {:title "SICM spike book"}
               :run-quarto true})
  (catch Exception e
    (println "BOOK FAIL:" (ex-message e))))

(System/exit 0)
