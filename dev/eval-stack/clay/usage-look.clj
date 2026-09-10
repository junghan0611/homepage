(ns usage-look
  (:require [usage :as usage]
            [scicloj.clay.v2.api :as clay]))

(clay/make! {:source-path "notebooks/preface.clj"
             :show false
             :browse false
             :base-target-path "docs-look"
             :flatten-targets true
             :format [:html]
             :post-process usage/inject-look})
(System/exit 0)
