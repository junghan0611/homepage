(ns usage
  (:require [scicloj.clay.v2.api :as clay]
            [clojure.string :as str]))

(defn inject-look
  "Cosmo 를 누르고 site/read.css (GLG Mono + 읽기 리듬) 를 싣는다.
   노트북 내용은 안 바꾼다."
  [html]
  (-> html
      (str/replace #"<html([^>]*)>"
                   "<html$1 data-webtui-theme=\"catppuccin-mocha\">")
      (str/replace
       "</head>"
       (str "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@webtui/css@0.1.9/dist/full.css\">"
            "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@webtui/theme-catppuccin@0.0.5/dist/index.css\">"
            "<link rel=\"stylesheet\" href=\"/site/read.css\">"
            "</head>"))))

(println "=== A [:html] + read.css ===")
(clay/make! {:source-path "notebooks/preface.clj"
             :show false
             :browse false
             :base-target-path "docs"
             :flatten-targets true
             :format [:html]
             :post-process inject-look})

(println "=== B inline-js-and-css 생략 (src=nil 실패, clay-spike.md) ===")

(System/exit 0)
