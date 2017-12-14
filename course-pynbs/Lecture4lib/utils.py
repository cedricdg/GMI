import numpy as np
from sklearn import datasets
import matplotlib
import pickle
import scipy.signal
import matplotlib.pylab as plt
from scipy.interpolate import interp1d


def get_iris_data(classes=[0, 1, 2]):
    iris = datasets.load_iris()
    features = np.array(iris.data)
    labels = np.array(iris.target)
    idx = []
    for c in classes:
        if len(idx) == 0:
            idx = np.where((labels == c))[0]
        else:
            idx = np.r_[idx, np.where((labels == c))[0]]
    cmap = matplotlib.cm.get_cmap('Set1')
    colors = cmap(labels)
    return features[idx, :], labels[idx], colors


def load_one_dollar_ds(gesture=None, path='Lecture4lib/onedol_ds.pkl', resample=False):
    d = pickle.load(open(path, 'rb'))
    data, labels = d['dataset'], d['labels']
    if gesture == None:
        if not resample:
            return data, labels
        else:
            data_ = []
            for g in data:
                n_length = 50
                f_x = interp1d(np.arange(0, len(g)), g[:, 0])
                f_y = interp1d(np.arange(0, len(g)), g[:, 1])
                nx = np.linspace(0, len(g) - 1, num=n_length, endpoint=True)
                g_ = np.zeros((n_length, 2))
                g_[:, 0] = f_x(nx)
                g_[:, 1] = f_y(nx)
                data_.append(g_)
            data_ = np.array(data_)
            labels = np.array(labels)
            return data_, labels

    else:
        idx = []
        if isinstance(gesture, list):
            gesture_list = gesture
        else:
            gesture_list = [gesture]
        for c in gesture_list:
            if len(idx) == 0:
                idx = [i for i, l in enumerate(labels) if l == c]
            else:
                idx_ = [i for i, l in enumerate(labels) if l == c]
                idx = np.r_[idx, idx_]
        data_ = []
        labels_ = []    
        if resample:
            for i in idx:
                g = data[i]
                n_length = 50
                f_x = interp1d(np.arange(0, len(g)), g[:, 0])
                f_y = interp1d(np.arange(0, len(g)), g[:, 1])
                nx = np.linspace(0, len(g) - 1, num=n_length, endpoint=True)
                g_ = np.zeros((n_length, 2))
                g_[:, 0] = f_x(nx)
                g_[:, 1] = f_y(nx)
                data_.append(g_)
                labels_.append(labels[i])
            data_ = np.array(data_)
        else:
            for i in idx:
                data_.append(data[i])
                labels_.append(labels[i])
        return data_, labels_


def mean_gesture(gesture, path='Lecture4lib/onedol_ds.pkl'):
    d, l = load_one_dollar_ds(gesture=gesture, path=path)
    data = []
    for g in d:
        f_x = interp1d(np.arange(0, len(g)), g[:, 0])
        f_y = interp1d(np.arange(0, len(g)), g[:, 1])
        nx = np.linspace(0, len(g) - 1, num=50, endpoint=True)
        g_ = np.zeros((50, 2))
        g_[:, 0] = f_x(nx)
        g_[:, 1] = f_y(nx)
        data.append(g_)
    data = np.array(data)
    return np.mean(data, axis=0)


def std_gesture(gesture, path='Lecture4lib/onedol_ds.pkl'):
    d, l = load_one_dollar_ds(gesture=gesture, path=path)
    data = []
    for g in d:
        f_x = interp1d(np.arange(0, len(g)), g[:, 0])
        f_y = interp1d(np.arange(0, len(g)), g[:, 1])
        nx = np.linspace(0, len(g) - 1, num=50, endpoint=True)
        g_ = np.zeros((50, 2))
        g_[:, 0] = f_x(nx)
        g_[:, 1] = f_y(nx)
        data.append(g_)
    data = np.array(data)
    return np.std(data, axis=0)


if __name__ == '__main__':
    mean_gesture(1, path='onedol_ds.pkl')
