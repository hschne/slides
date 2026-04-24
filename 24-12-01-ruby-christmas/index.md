## Frozen String Literals

![Freeze](./img/freeze.jpg)

---

## Frozen String Literals

```ruby
# frozen_string_literal: true

str = "Ruby"

str << " on Rails"

puts str
# `<main>': can't modify frozen String: "Ruby" (FrozenError)
```

---

## Frosty By Default (But Not Really ???) 


```ruby
str = "Ruby"

str << " on Rails"

puts str
Ruby on Rails
```

---

## Timeline

1. Release R0: introduce the deprecation warning (only if deprecation warnings enabled).
2. Release R1: make the deprecation warning show up regardless of verbosity level.
3. Release R2: make string literals frozen by default.

R0 could be 3.4, R1 be 3.7 and R2 be 4.0.

---

## IT

![IT](./img/it.jpg)

---

## IT

```ruby
["Ruby", "on", "Rails"].each { puts it }
```

---

## IT's just convenience, really

```ruby
["Ruby", "on", "Rails"].each { puts _1 }
# Ruby
# on
# Rails
# => ["Ruby", "on", "Rails"]

["Ruby", "on", "Rails"].each_with_index { puts _1, _2 }
````

---

## Each Array Gets Faster

```ruby
[1,2,3,4].each { ... }
```

---

## C is Just Too Slow?!

```
$ benchmark-driver benchmark/loop_each.yml -v --chruby 'before::before --yjit-call-threshold=1;after::after --yjit-call-threshold=1'
before: ruby 3.4.0dev (2024-01-13T00:28:26Z master f7178045bb) +YJIT [x86_64-linux]
after: ruby 3.4.0dev (2024-01-13T04:31:50Z builtin-array-each 18c9a45314) +YJIT [x86_64-linux]
Warming up --------------------------------------
           loop_each      2.451 i/s -       3.000 times in 1.223915s (407.97ms/i)
Calculating -------------------------------------
                         before       after
           loop_each      2.456      13.074 i/s -       7.000 times in 2.850521s 0.535404s

Comparison:
                        loop_each
               after:        13.1 i/s
              before:         2.5 i/s - 5.32x  slower
```

---

# Prism

![Prism](./img/prism.png)

---

## Why Prism?

- There were 11 different parser implementations (CRuby, MRuby, Truffle,...)
- Ruby is weird, so creating parsers for it is tough
- Some always lagging behind, bad for tooling
- Now there's just one. And it's made with modern tooling in mind (LSPs, formatters, linters...)

---

# Sources

- [Frozen String Literals ](https://bugs.ruby-lang.org/issues/20205)
- [Frozen String Literals @Saeloun](https://blog.saeloun.com/2024/05/20/frozen-string-literal/)
- [It @Saeloun](https://blog.saeloun.com/2024/06/19/ruby-3-4-makes-it-as-default-block-parameter/)
- [Array.each](https://bugs.ruby-lang.org/issues/20182)
- [Array.each PR](https://github.com/ruby/ruby/pull/6687)
- [Dead Code on Prism](https://shows.acast.com/dead-code/episodes/pondering-the-prism-with-kevin-newton)
- [Prism](https://supergood.software/rubys-new-prism-parser/)
- [Ruby News](https://github.com/ruby/ruby/blob/v3_4_0_preview2/NEWS.md)
