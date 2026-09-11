(ns eval.clay.render
  (:require [scicloj.clay.v2.api :as clay]))

;; Local authoring only. Netlify never runs this file; rendered output is ignored.
(clay/make! {:source-path "notebooks/preface.clj"
             :show false
             :browse false
             :base-target-path ".local/clay"
             :flatten-targets true
             :format [:html]})
