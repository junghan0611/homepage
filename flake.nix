{
  description = "junghanacs.github.io - Hugo Homepage";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.hugo
            pkgs.go
            pkgs.nodejs
            pkgs.gitleaks
          ];

          shellHook = ''
            echo "Homepage 개발 환경"
            echo "================================"
            echo "Hugo:    $(hugo version | head -c 40)"
            echo "Go:      $(go version)"
            echo "Node:    $(node --version)"
            echo ""
            echo "명령어:"
            echo "  hugo server           # 로컬 서버"
            echo "  hugo --gc --minify    # 빌드"
            echo ""
          '';
        };
      }
    );
}
