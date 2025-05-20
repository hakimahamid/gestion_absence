def proc = 'docker --version'.execute()
proc.waitFor()
println proc.in.text
