(ns usage-look
  (:require [scicloj.clay.v2.api :as clay]
            [clojure.string :as str]))

(defn inject-look [html]
  (str/replace
   html
   "</head>"
   (str "<style id=\"clay-spike-look\">"
        ":root{--bg:#1e1e2e;--text:#cdd6f4;--green:#a6e3a1;}"
        "body{background:var(--bg)!important;color:var(--text)!important;"
        "font-family:ui-monospace,SFMono-Regular,Menlo,monospace;max-width:90ch;margin:1lh auto;}"
        "h1,h2{color:var(--green);}"
        "</style></head>")))

(clay/make! {:source-path "notebooks/preface.clj"
             :show false
             :browse false
             :base-target-path "docs-look"
             :flatten-targets true
             :format [:html]
             :post-process inject-look})
(System/exit 0)
