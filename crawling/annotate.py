import csv
import random

def annotate_csv(input_file, output_file, num_lines, comment_col_index, split_str = ''):
    # Load already annotated lines
    annotated_lines = set()
    try:
        with open(output_file, 'r', encoding='utf-8') as outfile:
            reader = csv.reader(outfile)
            next(reader)  # Skip header
            for row in reader:
                annotated_lines.add(tuple(row[:-2]))  # Exclude the subjectivity and polarity columns
    except FileNotFoundError:
        pass

    # Open the input CSV file
    with open(input_file, 'r', newline='', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        # Open the output CSV file in append mode
        with open(output_file, 'a', newline='', encoding='utf-8') as outfile:
            writer = csv.writer(outfile)
            # If the output file is empty, write the header
            if not annotated_lines:
                header = next(reader)
                writer.writerow(header + ['Subjectivity', 'Polarity'])

            lines = list(reader)
            lines_to_annotate = random.sample(lines, min(num_lines, len(lines)))
            counter = 0
            try:
                for row in lines_to_annotate:
                    # Skip lines that have already been annotated
                    if tuple(row)[:-2] in annotated_lines:
                        continue
                    # Get the comment
                    item = row[comment_col_index]
                    subjectivity = -1
                    if(split_str!=''):
                        result = item.split(split_str)
                        if len(result) == 2:
                            subjectivity = input("Context:\n'{}'\n\nComment:\n'{}'\nSubjectivity (0 for neutral, 1 for opinionated): ".format(result[0], result[1]))
                        else:
                            subjectivity = input("\n'{}'\nSubjectivity (0 for neutral, 1 for opinionated): ".format(item))
                    else:
                        subjectivity = input("\n'{}'\nSubjectivity (0 for neutral, 1 for opinionated): ".format(item))

                    # If opinionated, prompt for polarity
                    if subjectivity == '1':
                        polarity = input("Polarity (0 for negative, 1 for positive): ")
                        if polarity != '1':
                            polarity = '0'
                    elif subjectivity == '0':
                        polarity = ''
                    else:
                        subjectivity = '-1'

                    # Write the row along with subjectivity and polarity to output CSV
                    if subjectivity != '-1':
                        counter += 1
                        writer.writerow(row + [subjectivity, polarity])
                    print('\n')
                    print(counter)
                    if counter>=90:
                        break
            except KeyboardInterrupt:
                print("Annotation interrupted. Annotations made so far have been saved.")

if __name__ == "__main__":
    input_file = 'data/tiktok-comments-processed.csv'
    output_file = 'data/tiktok_annotated.csv'
    annotate_csv(input_file, output_file, 500, 1, '')