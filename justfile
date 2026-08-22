# Preview site dev server — the library's first consumer
dev:
    cd preview && pnpm dev

# Library boundary gate: type errors plus rootDir overrun (L4)
check:
    pnpm run check

# Lint the library and the preview site
lint:
    pnpm run lint

# Publish-artifact snapshot gate (L5): the pack manifest must equal the
# forced-include set plus every git-tracked file under src/
verify-package:
    #!/usr/bin/env bash
    set -euo pipefail
    expected=$({
        echo package.json
        for f in README.md LICENSE; do [ -f "$f" ] && echo "$f"; done
        git ls-files --cached --others --exclude-standard src
    } | sort -u)
    actual=$(pnpm pack --dry-run --json | node -e '
        let s = "";
        process.stdin.on("data", d => s += d).on("end", () => {
            JSON.parse(s).files.forEach(f => console.log(f.path));
        });
    ' | sort -u)
    if [ "$expected" = "$actual" ]; then
        printf 'pack manifest matches the whitelist:\n%s\n' "$expected"
    else
        printf 'pack manifest drifted\n--- expected\n%s\n--- actual\n%s\n' "$expected" "$actual" >&2
        exit 1
    fi

# Version bump plus local tag. Pushing is a separate step that needs
# explicit approval every time: git push --follow-tags
release level:
    #!/usr/bin/env bash
    set -euo pipefail
    just check
    just verify-package
    pnpm version {{ level }} --no-git-tag-version
    v=$(node -p 'require("./package.json").version')
    git add package.json
    git commit -m "chore(release): v$v"
    git tag "v$v"
    printf 'tagged v%s — push it with: git push --follow-tags\n' "$v"
