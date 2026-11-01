#!/usr/bin/env ruby
# Smoke test for the actual Jekyll output; no network or non-standard gems needed.
require 'rexml/document'
require 'json'

root = ARGV.fetch(0, '_site')
origin = 'https://kiteawaysardinia.it'
languages = {'en' => '', 'it' => '/it', 'fr' => '/fr', 'de' => '/de'}
paths = {'home' => '/', 'privacy' => '/privacy/'}

raise 'Missing robots.txt' unless File.file?(File.join(root, 'robots.txt'))
robots = File.read(File.join(root, 'robots.txt'))
raise 'robots.txt is not pointing to Netsons' unless robots.include?("Sitemap: #{origin}/sitemap.xml")
raise 'OAI-SearchBot not allowed' unless robots.match?(/User-agent:\s*OAI-SearchBot\s*\nAllow:\s*\//i)

sitemap = REXML::Document.new(File.read(File.join(root, 'sitemap.xml')))
ns = {'s' => 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = REXML::XPath.match(sitemap, '//s:url/s:loc', ns).map(&:text)
expected_urls = paths.values.flat_map { |suffix| languages.values.map { |prefix| "#{origin}#{prefix}#{suffix}" } }
raise "Unexpected sitemap urls: #{urls.inspect}" unless urls.sort == expected_urls.sort

paths.each do |kind, suffix|
  languages.each do |lang, prefix|
    uri = "#{prefix}#{suffix}"
    file = File.join(root, uri.sub(%r{^/}, ''), 'index.html')
    file = File.join(root, 'index.html') if uri == '/'
    raise "Missing #{file}" unless File.file?(file)
    html = File.read(file)
    canonical = "#{origin}#{uri}"
    raise "Missing canonical #{canonical}" unless html.include?("rel=\"canonical\" href=\"#{canonical}\"")
    languages.each do |alternate, alt_prefix|
      target = "#{origin}#{alt_prefix}#{suffix}"
      raise "Missing #{alternate} alternate for #{file}" unless html.include?("hreflang=\"#{alternate}\" href=\"#{target}\"")
    end
    if kind == 'home'
      match = html.match(%r{<script type="application/ld\+json">\s*(.*?)\s*</script>}m)
      raise "Missing JSON-LD in #{file}" unless match
      data = JSON.parse(match[1])
      raise "Wrong structured data URL in #{file}" unless data['url'] == "#{origin}/"
    end
    raise 'Legacy GitHub Pages canonical found' if html.include?('rel="canonical" href="https://fgaudenzi.github.io')
  end
end

puts "SEO OK: #{urls.size} sitemap URLs, robots, canonical + hreflang across #{languages.length} languages, JSON-LD."
