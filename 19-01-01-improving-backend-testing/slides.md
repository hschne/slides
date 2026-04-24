### What is the Purpose of Tests? 

- We can't guarantee that our programs are error free
- We can reduce risk at a certain cost
- Testing always means considering <span class="highlight">Cost</span> vs. <span class="highlight">Benefit</span>

---

<img id="testing-pyramid" src="img/testing-pyramid.svg">

---

### What about Automated Tests? 

- Mostly used for finding regressions
- Big effort to write
- Low effort to run
- Effort to maintain... depends

---

### Effective Tests

Effective tests find the most bugs with the least amount of effort.

Reduce the cost of: <span class="highlight">Writing</span>, Executing, Maintenance

---

### Test Isolation 

> A test should ideally test exactly one thing

Otherwise: 
- More effort to write
- Brittle tests
- Non-Deterministic tests

---

### Mocks & Stubs

```ruby
# Request
response = HTTParty.post('url', query: parameters)
# Stub with Mocha
HTTParty.stubs(:post).returns(myBody)
response = HTTParty.post('url', query: parameters)
# VCR
VCR.use_cassette("casette") do
response = Net::HTTP.get_response(URI('url'))
end
```

---

### Test Data

> A test should use only the data that it needs - and that data should remain the same. 

Otherwise: 
- Hard to read
- Brittle tests

---

### Test Fixtures

```ruby
# Fixtures
person = persons(:business)
# Factorybot
person = create(:person)
# Setup & Teardown
def setup 
  ...
end
```

---

### Test Readability

> If a test fails it should be easy to understand and fix

Various factors: 
- Naming
- Length
- Test Data

---

### Arrange-Act-Assert

```ruby
test 'long attachment name is shortened' do
task = create(:task)
attachment_name = 'x' * 250
create(:attachment_local, name: attachment_name, task: task)

result = Exporters::AttachmentsData.new(task: task)
                                   .to_contents_for_task

result = result.dig(0)
assert_equal(100, result[:file_name].length)
end
```

---

#### Q: How can I avoid writing tests? 

Tell someone else to write them.

---

#### Q: When does it make sense to generate tests? 
 
Test case generation is complicated. Use only if you know what you are doing. 

---

### Parameterized Tests

```ruby
  param_test "%s includes whitespace is %s", [
    ["hello world", true],
    ["foo bar", true],
    ["foo", false],
  ] do |input, expected|
    assert_equal(expected, includes_whitespace?(input))
  end
```

---

#### Q: Should I use Rails fixtures or FactoryBot? 

Both are fine, but I prefer FactoryBot. Just keep isolation and readability in mind.

---

### Other Questions or Issues?

