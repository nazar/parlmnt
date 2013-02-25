#monkey patch base classes to add useful functionality

class String

  def self.random_string(len)
    rand_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" << "0123456789" << "abcdefghijklmnopqrstuvwxyz"
    rand_max = rand_chars.size
    srand
    ''.tap do |ret|
      len.times{ ret << rand_chars[rand(rand_max)] }
    end
  end

end