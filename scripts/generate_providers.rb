# Usage: ruby scripts/generate_providers.rb training_providers_and_ITT_record_counts.csv > app/data/reference/itt-providers.js

require 'csv'
require 'json'

def sanitised_name(name)
  name
    .yield_self { |n| n =~ /-(\s)*\d+(\/\d+)?/ ? n.split('-')[0] : n } # to clean up "University Of Plymouth - 8715" and "Wishmore Cross School DRB - 936/7024"
    .gsub('DRB', '') # to clean up entries like "DRB Institute of Education"
    .gsub('EBR', '') # to clean up entries like "EBR Institute of Education"
    .strip
end

provider_rows = CSV.read(ARGV[0], headers: true, encoding: 'bom|utf-8')

providers = provider_rows
  .map { |row| sanitised_name(row["name"]) }
  .sort
  .uniq { |elem| elem.downcase } # to deal with entries like "Institute of Education"/"Institute Of Education"

puts "export default\n#{JSON.pretty_generate(providers)}"
