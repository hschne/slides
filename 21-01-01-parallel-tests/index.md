Hi, I'm Hans 👋

💎 Ruby Developer from Vienna 🇦🇹

🔧 Currently employed at [Meister](https://www.meisterlabs.com/) ⭐

[![hschne.at](https://img.shields.io/static/v1?label=hschne.at&message=%20&color=green&logo=&style=flat-square&logoColor=white)](http://hschne.at)
[![Twitter](https://img.shields.io/static/v1?label=Twitter&message=%20&color=blue&logo=Twitter&style=flat-square&logoColor=white)](https://twitter.com/hschnedlitz)
[![Github](https://img.shields.io/static/v1?label=Github&message=%20&color=blue&logo=GitHub&style=flat-square&logoColor=white)](http://github.com/hschne)

Note:
Bit about myself.

Ruby dev from Vienna, duh.

I work at this place called Meister, you might have heard of it.

---

# I like Fast Tests

Note:
I like my tests fast. Faster tests are good.

If I have enough time to get up and get a coffee while the test suite finishes

Or if I have to wait 10 minutes for my CI checks to go green.

That irks me.

---

<section data-background-image="https://media.giphy.com/media/izspP6uMbMeti/giphy.gif?cid=ecf05e47l0y849z6lnzwbcfv667omekoukzuoq1z8k6hn8bv&rid=giphy.gif&ct=g">

Note:

The faster the better. I prefer ludicrous speed.

And it's not just because fast tests are cool.

And you can brag to your friends about it.

---

Faster tests means faster development.

Slow tests are boring and stupid 🐌

Note:
Faster tests mean you get faster feedback.

You can fix things quicker, turnaround times are quicker.

Also, it just feels good to have fast tests.

Slow tests on the other hand dont' feel good.

Nobody likes waiting.

---

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Hot take: your test suite should be running at 100 assertions/sec or faster</p>&mdash; Nate Berkopec (@nateberkopec) <a href="https://twitter.com/nateberkopec/status/1189213879592718336?ref_src=twsrc%5Etfw">October 29, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Note:
I'm not alone with that opinion.

Nate the performance guy also thinks so.

100 assertions/sec isn't really a viable speed measurement, but it sounds cool as a hot take.

---

<section data-background-image="https://media.giphy.com/media/3og0INAY5MLmEBubyU/giphy.gif?cid=ecf05e47qso497g79zu09mqzvsng892k4xe6a8f0pf9vhvfk&rid=giphy.gif&ct=g">

Note:
Now, there may be a lot of reasons why your test suite isnt fast.

And there are lots of ways to fix it.

Most of them tricky. If you've ever tried to diagnose and fix a slow test suite you know it's great fun.

We're not gonna talk about that.

But I'm gonna show you one simple trick to speed up your test suite.

---

# Parallel Tests

Note:
Normally, when you just run tests its just single process.

Works through the tests sequentially.

As the name suggests, parallel tests don't do that. They work in parallel.

Shocker, right?

---

### Twice the CPUs, Twice the Speed

Built-in in [Rails 6](https://edgeguides.rubyonrails.org/testing.html#parallel-testing) or using [parallel_tests](https://github.com/grosser/parallel_tests)

Note:
The idea is to take advantage of modern multi-core CPUs.

The more cores you have, the faster your tests get.

There are two major ways you can use that in Ruby.

Parallel tests is a gem you can use with Rspec and such.

It's been around for a long time.

Since Rails 6, parallel tests are built in with Rails.

And that's what I'm focusing on today. You can have parallel tests without Rails, but we're gonna focus on Rails here.

---

### Setup

```ruby
# test_helper.rb
class ActiveSupport::TestCase
  parallelize workers: :number_of_processors
end
```

Note:
First things first, how do you get your tests to run in parallel.

Step 1: You just chuck these lines into your test base class, or test class.

That's it. There's no step 2.

Number of processors is the default, meaning Rails will spawn as many test workers as you have processors.

---

### Default 🐌

```bash
rails test
3827/3827: [===============] 100% Time: 00:07:55
```

Note:
How does that compare in speed. I prepared some tests.

Here we see a test run for a nice juicy test suite. Without parallelization.

Takes around 8 minutes. Not great, not too bad for almost 4k tests either.

I'd love that to be way less though.

---

### Parallel 🦔

```bash
rails test
3827/3827: [===============] 100% Time: 00:01:40
```

Note:
This is what we get with parallel tests.

Down to less than two minutes with parallel tests.

Question, how many cores does the machine where this is running have?

That's already pretty nice.

---

### Overwrite

```bash
PARALLEL_WORKERS=0 rails test
```

Note:
There are some ways you can customize parallel tests.

I'll go through the most interesting ones real quick.

First, intead of using number of processors for workers, you can hardcode that.

You can also set it on a per-run basis, like we see here.

So it's customized using the parallel workers env var.

---

### Threads vs Processes

```ruby
parallelize workers: :number_of_processors, with: :threads
```

Note:
Another interesting thing, per default Rails uses seperate processes to run tests in parallel.

So if you have 4 cores, Rails wills start 4 worker processes, each taking on a portion of tests.

Alternatively, you can make it so Rails uses threads instead.

Threads are lighter, so better performance in theory. So you might want to experiment with that.

---

### Threshold

```ruby
# New in Rails 6.1.4.1
parallelize threshold: 100
```

Note:
When a new worker process is created, Rails also needs to setup a seperate database.

Essentially, that means if you have 4 cores, Rails will set up 4 databases, and start 4 processes.

That's a lot of overhead.

For few tests, the overhead may be more than actual speed gain.

In Rails 6.1.4.1 (PR was merged mid of July) Rails will only use parallelization if the number of tests exceeds a certain threshold.

---

# What's the catch?

Note:

So that's all nice and dandy.

Speedier tests for free, right?

Nothing's free.

---

```ruby
test 'create file' do
  file = File.write('test.txt', 'hello world')

  assert_path_exists('test.txt')
end

test 'delete file' do
  file = File.write('test.txt', 'hello world')

  File.delete('test.txt')

  assert_not(File.exist?('test.txt'))
end
```

Note:
Let's check these tests. If you run your tests sequentially there's nothing wrong with them.

What's wrong if you run those in parallel? Any ideas?

In parallel, you now got a race condition essentially.

You get flaky tests.

---

```ruby
test 'update with name' do
  record =
    User.find_or_create_by(email: 'test@mail.com') do |user|
      user.name = 'name'
      user.age = 30
    end

  record.update(name: 'new name')

  assert_equal('new name', record.name)
end
```

Note:
Another example. This one is more tricky. Imagine multiple tests similar to this one.

What may be wrong with that?

Here you gotta know that find_or_create_by is not thread safe.

Essentially, that's a race condition waiting to be happening, only on a DB level.

If you have unique constraints on the email for example, your tests will now sometimes fail.

Congratulations.

---

#### Resource contention becomes <span class="highlight">a lot</span> worse:

- Database
- File System
- Services (Elasticsearch, Redis...)
- ...

Note:

Essentially, whatever source of resource contention you already have is gonna get way worse.

If your app code is prone to deadlocks or whatever they are gonna show up way more often.

Or file system access that is not thread safe.

Or access to external resources they.

Your tests are just gonna fail randomly.

If you have some tests that cause these failures, there is a small workaround.

---

```ruby
class ParallelTestCase < ActiveSupport::TestCase
  parallelize(workers: :number_of_processors)

  parallelize_setup { |_worker| Rails.application.load_seed }
end
```

Note:
You can setup a specific test class for tests that should run in parallel

And use another one if you want to fall back to sequential execution.

So basically everything that can run in parallel is a parallel test case

And everything that is not a normal test case.

---

1. Fast tests are better than slow tests
2. Parallel tests can speed up your test suite a lot
3. They are almost free (but not really)

Give them a try! 🧪

---

Find the slides on [hschne.at/slides](https://hschne.at/slides)

Twitter - [@hschnedlitz](twitter.com/hschnedlitz)

GitHub - [github.com/hschne](github.com/hschne)

Notes:

And that's it from me. The slides are public if you want to check them out later.

Reach out to me on twitter or GitHub if you want later. I'm looking forward to your questions.

---

<section data-background-image="https://media.giphy.com/media/xUPOqo6E1XvWXwlCyQ/giphy.gif?cid=ecf05e47j06favu2ds4d5pe06ga8h2pqqg74grqpw4uclg7u&rid=giphy.gif&ct=g">
