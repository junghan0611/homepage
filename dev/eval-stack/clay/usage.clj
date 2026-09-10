(ns usage
  (:require [scicloj.clay.v2.api :as clay]
            [clojure.string :as str]))

(defn inject-look [html]
  (str/replace
   html
   "</head>"
   (str "<style id=\"clay-spike-look\">"
        ":root{--bg:#1e1e2e;--text:#cdd6f4;--green:#a6e3a1;--overlay:#6c7086;}"
        "body{background:var(--bg)!important;color:var(--text)!important;"
        "font-family:ui-monospace,SFMono-Regular,Menlo,monospace;max-width:90ch;margin:1lh auto;}"
        "h1,h2{color:var(--green);} a{color:#89b4fa;}"
        "</style></head>")))

(println "=== A default [:html] ===")
(clay/make! {:source-path "notebooks/preface.clj"
             :show false
             :browse false
             :base-target-path "docs"
             :flatten-targets true
             :format [:html]})

(println "=== B inline-js-and-css ===")
(clay/make! {:source-path "notebooks/preface.clj"
             :show false
             :browse false
             :base-target-path "docs-inline"
             :flatten-targets true
             :format [:html]
             :inline-js-and-css true})

(println "=== C post-process look ===")
(clay/make! {:source-path "notebooks/preface.clj"
             :show false
             :browse false
             :base-target-path "docs-look"
             :flatten-targets true
             :format [:html]
             :post-process inject-look})

(System/exit 0)
