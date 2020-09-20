# Define a simple lambda function that takes two arguments and sums them
sum = lambda x, y: x + y
print(sum(3, 5))

# Define a square function that takes one operator and squares it
square = lambda x: x**2
elements = [1, 3, 5, 7, 5, 3, 2]

# map() will map the 'square' function to a list of 'elements'.
# The result is a list of the memebers of the 'elements' list that
# have been squared. 
r = map(square, elements)

print(list(r))

# You can map multiple lists in a single map() call.
second_elements = [4, -4, 16]
result = map(square, elements, second_elements)

print(list(result))

